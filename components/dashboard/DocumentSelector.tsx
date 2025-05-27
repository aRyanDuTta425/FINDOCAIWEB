'use client'

import { useState } from 'react'

interface Document {
  id: string
  filename: string
  uploadedAt: string
  hasAnalysisResult: boolean
  documentType?: string
  amount: number
}

interface DocumentSelectorProps {
  documents: Document[]
  selectedDocumentId?: string
  onDocumentSelect: (documentId: string | null) => void
  className?: string
}

export function DocumentSelector({ 
  documents, 
  selectedDocumentId, 
  onDocumentSelect,
  className = '' 
}: DocumentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDocumentTypeColor = (type?: string) => {
    switch (type) {
      case 'invoice':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'bank_statement':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'tax_document':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const selectedDocument = documents.find(doc => doc.id === selectedDocumentId)

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Document Filter</h3>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
          {documents.length} documents
        </span>
      </div>

      <div className="relative">
        <select
          value={selectedDocumentId || 'all'}
          onChange={(e) => onDocumentSelect(e.target.value === 'all' ? null : e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
        >
          <option value="all">📊 All Documents - Combined Analysis</option>
          {documents.map((doc) => (
            <option key={doc.id} value={doc.id}>
              📄 {doc.filename} - {formatAmount(doc.amount)} ({formatDate(doc.uploadedAt)})
            </option>
          ))}
        </select>
      </div>

      {selectedDocument && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">{selectedDocument.filename}</h4>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>📅 {formatDate(selectedDocument.uploadedAt)}</span>
                {selectedDocument.documentType && (
                  <span className={`px-2 py-1 rounded-full text-xs border ${getDocumentTypeColor(selectedDocument.documentType)}`}>
                    {selectedDocument.documentType.replace('_', ' ')}
                  </span>
                )}
              </div>
              {!selectedDocument.hasAnalysisResult && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 border border-red-200">
                  ⚠️ No Analysis Available
                </div>
              )}
            </div>
            {selectedDocument.amount > 0 && (
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {formatAmount(selectedDocument.amount)}
                </div>
                <div className="text-xs text-gray-500">Total Amount</div>
              </div>
            )}
          </div>
        </div>
      )}

      {!selectedDocumentId && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">ℹ️</span>
            <div>
              <h4 className="font-medium text-blue-900">Combined View</h4>
              <p className="text-sm text-blue-700">
                Showing financial data from all {documents.length} uploaded documents.
                Select a specific document to view individual analysis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
