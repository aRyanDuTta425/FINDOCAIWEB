import Groq from 'groq-sdk';
import { PrismaClient } from '@prisma/client';
import { ragService, SearchResult } from './rag-service';

const prisma = new PrismaClient();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp?: Date;
}

export interface Citation {
  documentId: string;
  documentName: string;
  content: string;
  source: string;
  metadata?: {
    vendor?: string;
    amount?: number;
    date?: string;
    pageNumber?: number;
  };
}

export interface ChatResponse {
  message: ChatMessage;
  citations: Citation[];
}

export class ChatService {
  /**
   * Process a user query and generate a response using RAG
   */
  async processQuery(
    query: string,
    userId: string,
    conversationId?: string
  ): Promise<ChatResponse> {
    try {
      // Search for relevant content using RAG
      const searchResults = await ragService.searchSimilarContent(query, 10, userId);
      
      // Generate context from search results
      const context = ragService.generateContext(searchResults);
      
      // Create the prompt for Groq
      const prompt = this.createRAGPrompt(query, context, searchResults);
      
      // Generate response using Groq
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are FinDocAI, a helpful financial document assistant that analyzes uploaded financial documents including invoices, bank statements, tax documents, and receipts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.1-70b-versatile', // You can also use 'mixtral-8x7b-32768' or other Groq models
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9,
      });
      
      const response = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
      
      // Create citations from search results
      const citations = await this.createCitations(searchResults);
      
      // Save the conversation
      const savedMessage = await this.saveMessage(
        query,
        response,
        citations,
        userId,
        conversationId
      );
      
      return {
        message: {
          id: savedMessage.assistantMessage.id,
          role: 'assistant',
          content: response,
          citations,
          timestamp: savedMessage.assistantMessage.createdAt,
        },
        citations,
      };
      
    } catch (error) {
      console.error('Error processing chat query:', error);
      throw new Error('Failed to process query');
    }
  }

  /**
   * Create a structured prompt for RAG
   */
  private createRAGPrompt(query: string, context: string, searchResults: SearchResult[]): string {
    const hasRelevantData = searchResults.length > 0 && searchResults[0].similarity > 0.3;
    
    if (!hasRelevantData) {
      return `
The user asked: "${query}"

However, I couldn't find relevant information in their uploaded documents to answer this question.

Please provide a helpful response that:
1. Acknowledges that you don't have the specific information they're looking for
2. Suggests what type of document they might need to upload to get this information
3. Offers general guidance if appropriate

Keep your response friendly and helpful.
`;
    }

    return `
USER QUERY: "${query}"

RELEVANT CONTEXT FROM USER'S DOCUMENTS:
${context}

INSTRUCTIONS:
1. Answer the user's question based ONLY on the provided context from their documents
2. Be specific and cite amounts, dates, vendors when available
3. If you mention specific information, refer to it as "according to your documents" or "based on your uploaded files"
4. If the context doesn't fully answer the question, say so and suggest what additional information might be needed
5. Format financial amounts clearly (e.g., $1,234.56)
6. Format dates in a readable format (e.g., January 15, 2024)
7. Be conversational but professional
8. If asked about calculations or totals, show your work

IMPORTANT: Only use information from the provided context. Do not make up financial data or provide general financial advice not based on their documents.

Please provide a helpful and accurate response based on the user's financial documents.
`;
  }

  /**
   * Create citations from search results
   */
  private async createCitations(searchResults: SearchResult[]): Promise<Citation[]> {
    const citations: Citation[] = [];
    const documentIds = Array.from(new Set(searchResults.map(r => r.metadata.documentId)));
    
    // Get document information for citations
    const documents = await prisma.document.findMany({
      where: {
        id: { in: documentIds },
      },
    });

    const documentMap = new Map(documents.map(doc => [doc.id, doc]));

    for (const result of searchResults.slice(0, 5)) { // Limit to top 5 citations
      const document = documentMap.get(result.metadata.documentId);
      if (document && result.similarity > 0.3) { // Only include relevant citations
        citations.push({
          documentId: result.metadata.documentId,
          documentName: document.originalName,
          content: result.content.slice(0, 200) + (result.content.length > 200 ? '...' : ''),
          source: result.metadata.source || 'document',
          metadata: {
            vendor: result.metadata.vendor,
            amount: result.metadata.amount,
            date: result.metadata.date,
          },
        });
      }
    }

    return citations;
  }

  /**
   * Save chat messages to database
   */
  private async saveMessage(
    userQuery: string,
    assistantResponse: string,
    citations: Citation[],
    userId: string,
    conversationId?: string
  ) {
    let conversation;

    if (conversationId) {
      conversation = await prisma.chatConversation.findUnique({
        where: { id: conversationId, userId },
      });
    }

    if (!conversation) {
      // Create new conversation with auto-generated title
      const title = this.generateConversationTitle(userQuery);
      conversation = await prisma.chatConversation.create({
        data: {
          title,
          userId,
        },
      });
    }

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        content: userQuery,
        role: 'user',
        conversationId: conversation.id,
      },
    });

    // Save assistant message with citations
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        content: assistantResponse,
        role: 'assistant',
        conversationId: conversation.id,
        metadata: {
          citations: citations.map(citation => ({
            documentId: citation.documentId,
            documentName: citation.documentName,
            content: citation.content,
            source: citation.source,
            metadata: citation.metadata,
          })),
        },
      },
    });

    return {
      conversation,
      userMessage,
      assistantMessage,
    };
  }

  /**
   * Generate a conversation title from the first user query
   */
  private generateConversationTitle(query: string): string {
    // Extract key terms for title generation
    const words = query.toLowerCase().split(' ');
    const financialTerms = ['spending', 'expense', 'income', 'payment', 'invoice', 'receipt', 'transaction'];
    const foundTerms = words.filter(word => financialTerms.includes(word));
    
    if (foundTerms.length > 0) {
      return `Chat about ${foundTerms[0]}`;
    }
    
    // Fallback to first few words
    const titleWords = query.split(' ').slice(0, 4).join(' ');
    return titleWords.length > 30 ? titleWords.slice(0, 30) + '...' : titleWords;
  }

  /**
   * Get chat conversation history
   */
  async getConversationHistory(conversationId: string, userId: string): Promise<ChatMessage[]> {
    const messages = await prisma.chatMessage.findMany({
      where: {
        conversationId,
        conversation: {
          userId,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      citations: msg.role === 'assistant' && msg.metadata 
        ? (msg.metadata as any).citations || []
        : undefined,
      timestamp: msg.createdAt,
    }));
  }

  /**
   * Get user's conversation list
   */
  async getUserConversations(userId: string): Promise<Array<{
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    lastMessage?: string;
  }>> {
    const conversations = await prisma.chatConversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map(conv => ({
      id: conv.id,
      title: conv.title || 'Untitled Chat',
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      lastMessage: conv.messages[0]?.content.slice(0, 100),
    }));
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string, userId: string): Promise<void> {
    await prisma.chatConversation.delete({
      where: {
        id: conversationId,
        userId,
      },
    });
  }

  /**
   * Update conversation title
   */
  async updateConversationTitle(conversationId: string, title: string, userId: string): Promise<void> {
    await prisma.chatConversation.update({
      where: {
        id: conversationId,
        userId,
      },
      data: {
        title,
      },
    });
  }
}

export const chatService = new ChatService();
