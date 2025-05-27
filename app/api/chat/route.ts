import { NextRequest, NextResponse } from 'next/server';
import { chatService } from '@/lib/chat-service';
import { ragService } from '@/lib/rag-service';
import jwt from 'jsonwebtoken';

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

// POST /api/chat - Send a new message
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, conversationId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Process the query using RAG
    const response = await chatService.processQuery(message, userId, conversationId);

    return NextResponse.json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

// GET /api/chat - Get conversation list
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      // Get specific conversation history
      const messages = await chatService.getConversationHistory(conversationId, userId);
      return NextResponse.json({
        success: true,
        data: { messages },
      });
    } else {
      // Get conversation list
      const conversations = await chatService.getUserConversations(userId);
      return NextResponse.json({
        success: true,
        data: { conversations },
      });
    }

  } catch (error) {
    console.error('Error fetching chat data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat data' },
      { status: 500 }
    );
  }
}

// DELETE /api/chat - Delete a conversation
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = await request.json();

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    await chatService.deleteConversation(conversationId, userId);

    return NextResponse.json({
      success: true,
      message: 'Conversation deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}

// PUT /api/chat - Update conversation title
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, title } = await request.json();

    if (!conversationId || !title) {
      return NextResponse.json({ 
        error: 'Conversation ID and title are required' 
      }, { status: 400 });
    }

    await chatService.updateConversationTitle(conversationId, title, userId);

    return NextResponse.json({
      success: true,
      message: 'Conversation title updated successfully',
    });

  } catch (error) {
    console.error('Error updating conversation title:', error);
    return NextResponse.json(
      { error: 'Failed to update conversation title' },
      { status: 500 }
    );
  }
}
