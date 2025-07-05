import Groq from 'groq-sdk';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export interface EmbeddingChunk {
  content: string;
  embedding: number[];
  metadata: {
    documentId: string;
    documentType: string;
    chunkIndex: number;
    source?: string;
    pageNumber?: number;
    vendor?: string;
    amount?: number;
    date?: string;
  };
}

export interface SearchResult {
  content: string;
  similarity: number;
  metadata: {
    documentId: string;
    documentType: string;
    source?: string;
    vendor?: string;
    amount?: number;
    date?: string;
  };
}

export class RAGService {
  /**
   * Generate embeddings using a simple hash-based approach
   * Note: Groq doesn't provide embeddings API, so we use a simple similarity approach
   * For production, consider using OpenAI, Cohere, or Hugging Face embeddings
   */
  async generateEmbedding(text: string): Promise<number[]> {
    // Simple hash-based embedding for demonstration
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0);
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j);
        embedding[j % 384] += charCode / (i + 1);
      }
    }
    
    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return embedding;
    
    return embedding.map(val => val / magnitude);
  }

  /**
   * Chunk large text into smaller pieces for better embedding
   */
  chunkText(text: string, maxChunkSize: number = 1000): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text];
  }

  /**
   * Process and embed a document's content and analysis results
   */
  async embedDocument(documentId: string): Promise<void> {
    try {
      const document = await prisma.document.findUnique({
        where: { id: documentId },
        include: {
          ocrData: true,
          analysisResult: true,
        },
      });

      if (!document) {
        throw new Error('Document not found');
      }

      const chunks: EmbeddingChunk[] = [];

      // Embed OCR text if available
      if (document.ocrData?.text) {
        const textChunks = this.chunkText(document.ocrData.text);
        for (let i = 0; i < textChunks.length; i++) {
          const embedding = await this.generateEmbedding(textChunks[i]);
          chunks.push({
            content: textChunks[i],
            embedding,
            metadata: {
              documentId,
              documentType: document.analysisResult?.documentType || 'unknown',
              chunkIndex: i,
              source: 'ocr',
            },
          });
        }
      }

      // Embed structured analysis data
      if (document.analysisResult) {
        const analysis = document.analysisResult;
        const structuredData = [];

        // Create searchable text from structured data
        if (analysis.documentType === 'invoice') {
          const invoiceText = `Invoice ${analysis.invoiceNumber} from ${analysis.vendor} for amount $${analysis.amount} due on ${analysis.dueDate}`;
          structuredData.push({
            text: invoiceText,
            metadata: {
              vendor: analysis.vendor || undefined,
              amount: analysis.amount || undefined,
              date: analysis.dueDate?.toISOString(),
            },
          });
        } else if (analysis.documentType === 'bank_statement') {
          const bankText = `Bank statement for account ${analysis.accountNumber} with balance $${analysis.balance} dated ${analysis.statementDate}`;
          structuredData.push({
            text: bankText,
            metadata: {
              amount: analysis.balance || undefined,
              date: analysis.statementDate?.toISOString(),
            },
          });
        }

        // Embed summary if available
        if (analysis.summary) {
          structuredData.push({
            text: analysis.summary,
            metadata: {},
          });
        }

        // Embed extracted data
        if (analysis.extractedData && typeof analysis.extractedData === 'object') {
          const extractedText = JSON.stringify(analysis.extractedData);
          structuredData.push({
            text: extractedText,
            metadata: {},
          });
        }

        for (let i = 0; i < structuredData.length; i++) {
          const item = structuredData[i];
          const embedding = await this.generateEmbedding(item.text);
          chunks.push({
            content: item.text,
            embedding,
            metadata: {
              documentId,
              documentType: analysis.documentType,
              chunkIndex: chunks.length + i,
              source: 'analysis',
              ...item.metadata,
            },
          });
        }
      }

      // Store embeddings in database
      await this.storeEmbeddings(chunks);

    } catch (error) {
      console.error('Error embedding document:', error);
      throw new Error('Failed to embed document');
    }
  }

  /**
   * Store embedding chunks in the database
   */
  private async storeEmbeddings(chunks: EmbeddingChunk[]): Promise<void> {
    for (const chunk of chunks) {
      await prisma.documentEmbedding.create({
        data: {
          id: uuidv4(),
          content: chunk.content,
          embedding: chunk.embedding,
          chunkIndex: chunk.metadata.chunkIndex,
          metadata: chunk.metadata,
          documentId: chunk.metadata.documentId,
        },
      });
    }
  }

  /**
   * Search for similar content using vector similarity
   */
  async searchSimilarContent(query: string, limit: number = 5, userId?: string): Promise<SearchResult[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(query);

      // Get all embeddings for the user's documents
      const whereClause = userId ? {
        document: {
          userId: userId,
        },
      } : {};

      const embeddings = await prisma.documentEmbedding.findMany({
        where: whereClause,
        include: {
          document: true,
        },
      });

      // Calculate similarity scores
      const results: SearchResult[] = embeddings.map(embedding => {
        const similarity = this.cosineSimilarity(queryEmbedding, embedding.embedding);
        return {
          content: embedding.content,
          similarity,
          metadata: {
            documentId: embedding.documentId,
            documentType: (embedding.metadata as any)?.documentType || 'unknown',
            source: (embedding.metadata as any)?.source,
            vendor: (embedding.metadata as any)?.vendor,
            amount: (embedding.metadata as any)?.amount,
            date: (embedding.metadata as any)?.date,
          },
        };
      });

      // Sort by similarity and return top results
      return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

    } catch (error) {
      console.error('Error searching content:', error);
      throw new Error('Failed to search content');
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * Generate context for RAG from search results
   */
  generateContext(searchResults: SearchResult[]): string {
    if (searchResults.length === 0) {
      return "No relevant information found in your documents.";
    }

    let context = "Based on your uploaded documents, here's the relevant information:\n\n";
    
    searchResults.forEach((result, index) => {
      context += `${index + 1}. ${result.content}\n`;
      if (result.metadata.vendor) {
        context += `   - Vendor: ${result.metadata.vendor}\n`;
      }
      if (result.metadata.amount) {
        context += `   - Amount: $${result.metadata.amount}\n`;
      }
      if (result.metadata.date) {
        context += `   - Date: ${new Date(result.metadata.date).toLocaleDateString()}\n`;
      }
      context += "\n";
    });

    return context;
  }

  /**
   * Re-embed all documents for a user (useful for updates)
   */
  async reembedAllDocuments(userId: string): Promise<void> {
    const documents = await prisma.document.findMany({
      where: { userId },
    });

    // Delete existing embeddings
    await prisma.documentEmbedding.deleteMany({
      where: {
        document: {
          userId,
        },
      },
    });

    // Re-embed all documents
    for (const document of documents) {
      await this.embedDocument(document.id);
    }
  }
}

export const ragService = new RAGService();
