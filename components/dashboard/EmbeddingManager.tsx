'use client';

import { useState, useEffect } from 'react';
import { FileText, Zap, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmbeddingStatus {
  documentId: string;
  filename: string;
  embeddingCount: number;
  isEmbedded: boolean;
}

interface EmbeddingData {
  totalDocuments: number;
  embeddedDocuments: number;
  embeddingStatus: EmbeddingStatus[];
}

export default function EmbeddingManager() {
  const [embeddingData, setEmbeddingData] = useState<EmbeddingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [embeddingInProgress, setEmbeddingInProgress] = useState<string | null>(null);
  const [reembeddingAll, setReembeddingAll] = useState(false);

  useEffect(() => {
    loadEmbeddingStatus();
  }, []);

  const loadEmbeddingStatus = async () => {
    try {
      const response = await fetch('/api/embeddings');
      const data = await response.json();
      
      if (data.success) {
        setEmbeddingData(data.data);
      }
    } catch (error) {
      console.error('Error loading embedding status:', error);
    } finally {
      setLoading(false);
    }
  };

  const embedDocument = async (documentId: string) => {
    setEmbeddingInProgress(documentId);
    
    try {
      const response = await fetch('/api/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId }),
      });

      if (response.ok) {
        await loadEmbeddingStatus(); // Refresh status
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to embed document');
      }
    } catch (error) {
      console.error('Error embedding document:', error);
      alert('Failed to embed document. Please try again.');
    } finally {
      setEmbeddingInProgress(null);
    }
  };

  const reembedAllDocuments = async () => {
    setReembeddingAll(true);
    
    try {
      const response = await fetch('/api/embeddings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await loadEmbeddingStatus(); // Refresh status
        alert('All documents have been re-embedded successfully!');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to re-embed documents');
      }
    } catch (error) {
      console.error('Error re-embedding documents:', error);
      alert('Failed to re-embed documents. Please try again.');
    } finally {
      setReembeddingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!embeddingData) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load embedding status</p>
      </div>
    );
  }

  const completionPercentage = embeddingData.totalDocuments > 0 
    ? Math.round((embeddingData.embeddedDocuments / embeddingData.totalDocuments) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Document Embeddings</h2>
              <p className="text-gray-600 mt-1">
                Manage vector embeddings for your financial documents to enable intelligent chat queries
              </p>
            </div>
            <button
              onClick={reembedAllDocuments}
              disabled={reembeddingAll || embeddingData.totalDocuments === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${reembeddingAll ? 'animate-spin' : ''}`} />
              {reembeddingAll ? 'Re-embedding...' : 'Re-embed All'}
            </button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{embeddingData.totalDocuments}</p>
                  <p className="text-sm text-gray-600">Total Documents</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{embeddingData.embeddedDocuments}</p>
                  <p className="text-sm text-gray-600">Embedded Documents</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{completionPercentage}%</p>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Embedding Progress</span>
              <span className="text-sm text-gray-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Document Status</h3>
          
          {embeddingData.embeddingStatus.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No documents found. Upload some financial documents to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {embeddingData.embeddingStatus.map((doc) => (
                <motion.div
                  key={doc.documentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.filename}</p>
                      <p className="text-sm text-gray-500">
                        {doc.isEmbedded 
                          ? `${doc.embeddingCount} embedding chunks` 
                          : 'Not embedded'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {doc.isEmbedded ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Embedded</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-gray-500">Not embedded</span>
                      </div>
                    )}

                    <button
                      onClick={() => embedDocument(doc.documentId)}
                      disabled={embeddingInProgress === doc.documentId}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {embeddingInProgress === doc.documentId ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                          Embedding...
                        </div>
                      ) : (
                        doc.isEmbedded ? 'Re-embed' : 'Embed'
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">How Document Embeddings Work</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            • <strong>Embeddings</strong> convert your document text into vector representations that enable semantic search
          </p>
          <p>
            • <strong>Chat queries</strong> use these embeddings to find relevant information from your documents
          </p>
          <p>
            • <strong>Re-embedding</strong> may be necessary if you want to update the search index or if embeddings fail
          </p>
          <p>
            • <strong>Embedded documents</strong> will provide more accurate and detailed responses in chat
          </p>
        </div>
      </div>
    </div>
  );
}
