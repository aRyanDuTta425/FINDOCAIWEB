'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Send, Plus, Trash2, Edit3, FileText, ExternalLink, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileNav from '@/components/MobileNav';

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp?: Date;
}

interface Citation {
  documentId: string;
  documentName: string;
  content: string;
  source: string;
  metadata?: {
    vendor?: string;
    amount?: number;
    date?: string;
  };
}

interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: string;
}

export default function ChatPage() {
  const { user, logout, loading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/chat', {
        credentials: 'include'
      });
      
      if (response.status === 401) {
        console.log('Unauthorized access to chat - user not logged in');
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.data.conversations);
      } else {
        console.error('Failed to load conversations:', data.error);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversationHistory = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/chat?conversationId=${conversationId}`);
      const data = await response.json();
      
      if (data.success) {
        // Convert timestamp strings back to Date objects
        const messagesWithDates = data.data.messages.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined
        }));
        setMessages(messagesWithDates);
        setCurrentConversation(conversationId);
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationId: currentConversation,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, data.data.message]);
        
        // Update conversation list if this was a new conversation
        if (!currentConversation) {
          await loadConversations();
        }
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setCurrentConversation(null);
    setMessages([]);
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationId }),
      });

      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        if (currentConversation === conversationId) {
          startNewConversation();
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FinDocAI</span>
              <nav className="hidden md:flex ml-8 space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link href="/dashboard/financial" className="text-gray-600 hover:text-gray-900">Financial</Link>
                <Link href="/dashboard/documents" className="text-gray-600 hover:text-gray-900">Documents</Link>
                <Link href="/chat" className="text-blue-600 font-medium">Chat</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline text-sm text-gray-600">
                Welcome, {user?.name || user?.email}
              </span>
              <button
                onClick={logout}
                className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
              <MobileNav 
                currentPage="chat" 
                userName={user?.name || user?.email}
                onLogout={logout}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-80 bg-white border-r border-gray-200 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold text-gray-900">FinDocAI Chat</h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <button
                onClick={startNewConversation}
                className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    currentConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                  onClick={() => loadConversationHistory(conversation.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.title}
                      </h3>
                      {conversation.lastMessage && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {conversation.lastMessage}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(conversation.updatedAt.toString())}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              {currentConversation ? 'Financial Document Chat' : 'Ask questions about your documents'}
            </h2>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to FinDocAI Chat
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Ask questions about your uploaded financial documents. For example:
                "What was my total spending in January?" or "List all Uber rides last month."
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className={message.role === 'user' ? 'text-white' : 'text-gray-900'}>
                      {line}
                    </p>
                  ))}
                </div>

                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-2">Sources:</p>
                    <div className="space-y-2">
                      {message.citations.map((citation, citationIndex) => (
                        <div
                          key={citationIndex}
                          className="bg-gray-50 p-2 rounded text-xs border border-gray-200"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-3 h-3 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              {citation.documentName}
                            </span>
                          </div>
                          <p className="text-gray-600 line-clamp-2 mb-1">
                            {citation.content}
                          </p>
                          {citation.metadata && (
                            <div className="flex gap-4 text-gray-500">
                              {citation.metadata.vendor && (
                                <span>Vendor: {citation.metadata.vendor}</span>
                              )}
                              {citation.metadata.amount && (
                                <span>Amount: {formatCurrency(citation.metadata.amount)}</span>
                              )}
                              {citation.metadata.date && (
                                <span>Date: {formatDate(citation.metadata.date)}</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {message.timestamp && (
                  <div className="mt-2 text-xs opacity-70">
                    {message.timestamp instanceof Date 
                      ? message.timestamp.toLocaleTimeString()
                      : new Date(message.timestamp).toLocaleTimeString()
                    }
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask a question about your financial documents..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
