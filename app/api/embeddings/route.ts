import { NextRequest, NextResponse } from 'next/server';
import { ragService } from '@/lib/rag-service';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient();

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return decoded.userId;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

// POST /api/embeddings/embed - Embed a specific document
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId } = await request.json();

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    // Verify the document belongs to the user
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: userId,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Embed the document
    await ragService.embedDocument(documentId);

    return NextResponse.json({
      success: true,
      message: 'Document embedded successfully',
    });

  } catch (error) {
    console.error('Error embedding document:', error);
    return NextResponse.json(
      { error: 'Failed to embed document' },
      { status: 500 }
    );
  }
}

// POST /api/embeddings/embed-all - Embed all user documents
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Re-embed all documents for the user
    await ragService.reembedAllDocuments(userId);

    return NextResponse.json({
      success: true,
      message: 'All documents re-embedded successfully',
    });

  } catch (error) {
    console.error('Error re-embedding documents:', error);
    return NextResponse.json(
      { error: 'Failed to re-embed documents' },
      { status: 500 }
    );
  }
}

// GET /api/embeddings/status - Get embedding status for user documents
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get document and embedding counts
    const documents = await prisma.document.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            embeddings: true,
          },
        },
      },
    });

    const embeddingStatus = documents.map(doc => ({
      documentId: doc.id,
      filename: doc.originalName,
      embeddingCount: doc._count.embeddings,
      isEmbedded: doc._count.embeddings > 0,
    }));

    const totalDocuments = documents.length;
    const embeddedDocuments = embeddingStatus.filter(doc => doc.isEmbedded).length;

    return NextResponse.json({
      success: true,
      data: {
        totalDocuments,
        embeddedDocuments,
        embeddingStatus,
      },
    });

  } catch (error) {
    console.error('Error fetching embedding status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch embedding status' },
      { status: 500 }
    );
  }
}
