'use client'

import { useState } from 'react'
import { FileText, Image, Eye, Scan, Brain, Download, Calendar, DollarSign } from 'lucide-react'
import { formatFileSize, formatDateTime, getDocumentTypeColor, getDocumentTypeLabel } from '@/lib/utils'

interface Document {
  id: string
  filename: string
  originalName: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: string
  ocrData?: {
    text: string
    confidence: number
    processedAt: string
  }
  analysisResult?: {
    documentType: string
    summary?: string
    confidence?: number
    invoiceNumber?: string
    amount?: number
    vendor?: string
    [key: string]: any
  }
}

interface DocumentListProps {
  documents: Document[]
  loading: boolean
  onSelectDocument: (document: Document) => void
  onProcessDocument: (documentId: string, type: 'ocr' | 'analyze') => void
}

export default function DocumentList({
  documents,
  loading,
  onSelectDocument,
  onProcessDocument,
}: DocumentListProps) {
  const [processingStates, setProcessingStates] = useState<Record<string, 'ocr' | 'analyze' | null>>({})

  const handleProcess = async (documentId: string, type: 'ocr' | 'analyze') => {
    setProcessingStates(prev => ({ ...prev, [documentId]: type }))
    
    try {
      await onProcessDocument(documentId, type)
    } finally {
      setProcessingStates(prev => ({ ...prev, [documentId]: null }))
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="bg-secondary-200 rounded-md w-12 h-12"></div>
                <div className="flex-1 space-y-2">
                  <div className="bg-secondary-200 rounded h-4 w-3/4"></div>
                  <div className="bg-secondary-200 rounded h-3 w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="card text-center py-12">
        <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-secondary-900 mb-2">
          No Documents Found
        </h3>
        <p className="text-secondary-600">
          Upload your first document to get started with AI-powered analysis
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="space-y-4">
        {documents.map((document) => {
          const isProcessing = processingStates[document.id]
          const hasOCR = !!document.ocrData
          const hasAnalysis = !!document.analysisResult

          return (
            <div
              key={document.id}
              className="border border-secondary-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
              onClick={() => onSelectDocument(document)}
            >
              <div className="flex items-start space-x-4">
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {document.fileType.startsWith('image/') ? (
                    <Image className="h-10 w-10 text-primary-600" />
                  ) : (
                    <FileText className="h-10 w-10 text-primary-600" />
                  )}
                </div>

                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-secondary-900 truncate">
                        {document.originalName}
                      </h4>
                      <div className="mt-1 flex items-center space-x-4 text-xs text-secondary-500">
                        <span>{formatFileSize(document.fileSize)}</span>
                        <span>{formatDateTime(document.uploadedAt)}</span>
                      </div>
                    </div>

                    {/* Document Type Badge */}
                    {hasAnalysis && (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentTypeColor(
                          document.analysisResult!.documentType
                        )}`}
                      >
                        {getDocumentTypeLabel(document.analysisResult!.documentType)}
                      </span>
                    )}
                  </div>

                  {/* Analysis Summary */}
                  {hasAnalysis && document.analysisResult?.summary && (
                    <p className="mt-2 text-sm text-secondary-600 line-clamp-2">
                      {document.analysisResult.summary}
                    </p>
                  )}

                  {/* Key Info */}
                  {hasAnalysis && (
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      {document.analysisResult?.amount && (
                        <div className="flex items-center text-secondary-600">
                          <DollarSign className="h-3 w-3 mr-1" />
                          ${document.analysisResult.amount.toFixed(2)}
                        </div>
                      )}
                      {document.analysisResult?.dueDate && (
                        <div className="flex items-center text-secondary-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(document.analysisResult.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-3 flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(document.fileUrl, '_blank')
                      }}
                      className="inline-flex items-center px-2 py-1 text-xs bg-secondary-100 text-secondary-700 rounded hover:bg-secondary-200"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </button>

                    {!hasOCR && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProcess(document.id, 'ocr')
                        }}
                        disabled={!!isProcessing}
                        className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                      >
                        {isProcessing === 'ocr' ? (
                          <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent mr-1"></div>
                        ) : (
                          <Scan className="h-3 w-3 mr-1" />
                        )}
                        {isProcessing === 'ocr' ? 'Processing...' : 'Extract Text'}
                      </button>
                    )}

                    {hasOCR && !hasAnalysis && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProcess(document.id, 'analyze')
                        }}
                        disabled={!!isProcessing}
                        className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                      >
                        {isProcessing === 'analyze' ? (
                          <div className="animate-spin rounded-full h-3 w-3 border border-green-600 border-t-transparent mr-1"></div>
                        ) : (
                          <Brain className="h-3 w-3 mr-1" />
                        )}
                        {isProcessing === 'analyze' ? 'Analyzing...' : 'Analyze'}
                      </button>
                    )}

                    {/* Status Indicators */}
                    <div className="flex items-center space-x-1">
                      {hasOCR && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" title="Text extracted"></div>
                      )}
                      {hasAnalysis && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="Analyzed"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
