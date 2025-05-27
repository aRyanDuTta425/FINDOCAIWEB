# FinDocAI Chat Feature

## Overview

The FinDocAI Chat feature is a comprehensive RAG (Retrieval-Augmented Generation) powered chat system that allows users to ask natural language questions about their uploaded financial documents.

## Features

- **ChatGPT-like Interface**: Clean, intuitive chat UI with conversation history
- **RAG Integration**: Uses LangChain and vector embeddings to search through document content
- **Gemini 2.0 Flash**: Powers intelligent responses with context from your documents
- **Citations**: Every response includes links back to the original documents
- **Conversation Management**: Save, delete, and manage multiple chat conversations
- **Auto-Embedding**: Documents are automatically processed for embeddings when uploaded

## How to Use

### 1. Navigation
- Access the chat from any page using the "Chat" link in the navigation menu
- Available on both desktop navigation and mobile menu

### 2. Starting a Chat
- Click "New Chat" to start a new conversation
- Your previous conversations are listed in the sidebar
- Click on any conversation to view its history

### 3. Asking Questions
Examples of questions you can ask:
- "What was my total spending in January?"
- "List all Uber rides last month"
- "Show me my highest expenses by category"
- "What did I spend on groceries this month?"
- "Find all transactions from Starbucks"

### 4. Understanding Responses
- Responses include relevant information extracted from your documents
- Citations show which documents the information came from
- Click on citations to see the source document and specific content

## Technical Implementation

### Architecture
- **RAG Service** (`/lib/rag-service.ts`): Handles document embedding and vector search
- **Chat Service** (`/lib/chat-service.ts`): Manages conversations and AI responses
- **API Endpoints**: 
  - `/api/chat` - Chat message handling
  - `/api/embeddings` - Document embedding management

### Database Models
- **DocumentEmbedding**: Stores vector embeddings for document chunks
- **ChatConversation**: Manages chat sessions
- **ChatMessage**: Individual messages with citations

### Auto-Embedding Process
1. Document uploaded via `/api/upload`
2. `ragService.embedDocument()` triggered automatically
3. OCR completion also regenerates embeddings
4. Documents are chunked and vectorized using Gemini embeddings

## Managing Embeddings

### Embedding Manager
Available in the Financial Dashboard:
- View embedding status for all documents
- Re-embed specific documents
- Bulk re-embedding for all documents
- Progress tracking and completion metrics

### Manual Embedding
If auto-embedding fails, you can manually trigger embedding generation:
1. Go to Financial Dashboard
2. Scroll to "Embedding Management" section
3. Click "Generate Embeddings" for specific documents

## Performance Notes

- Embeddings are generated in the background to avoid blocking uploads
- Vector search uses cosine similarity for relevance
- Conversations are persisted and can be accessed across sessions
- Chat responses include structured data when available (amounts, dates, vendors)

## API Usage

### Chat API
```javascript
// Send a message
POST /api/chat
{
  "message": "What was my spending last month?",
  "conversationId": "optional-conversation-id"
}

// Get conversation history
GET /api/chat?conversationId=CONVERSATION_ID

// Delete conversation
DELETE /api/chat
{
  "conversationId": "CONVERSATION_ID"
}
```

### Embeddings API
```javascript
// Generate embeddings for a document
POST /api/embeddings
{
  "documentId": "DOCUMENT_ID"
}

// Re-embed all documents
PUT /api/embeddings

// Get embedding status
GET /api/embeddings
```

## Error Handling

- Failed embedding generation is logged but doesn't block document upload
- Chat responses include error handling for API failures
- Conversation history is preserved even if individual messages fail
- Retry mechanisms for embedding generation

## Security

- All chat conversations are scoped to the authenticated user
- Document embeddings are isolated by user ID
- JWT authentication required for all chat and embedding operations
- No cross-user data access possible
