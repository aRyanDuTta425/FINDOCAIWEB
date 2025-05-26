'use client'

import { useState } from 'react'
import { Edit3, Save, X, RefreshCw } from 'lucide-react'

interface OCRData {
  id: string
  text: string
  confidence: number
  processedAt: string
  documentId: string
  documentName: string
}

interface EditableOCRPanelProps {
  ocrData: OCRData[]
  loading?: boolean
  onUpdateOCR: (id: string, newText: string) => void
  onReprocessOCR: (documentId: string) => void
}

export default function EditableOCRPanel({
  ocrData,
  loading,
  onUpdateOCR,
  onReprocessOCR
}: EditableOCRPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const handleStartEdit = (ocr: OCRData) => {
    setEditingId(ocr.id)
    setEditText(ocr.text)
  }

  const handleSaveEdit = async () => {
    if (editingId) {
      await onUpdateOCR(editingId, editText)
      setEditingId(null)
      setEditText('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100'
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">OCR Data</h3>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-secondary-200 rounded-lg p-4">
              <div className="h-4 bg-secondary-200 rounded w-1/2 mb-2"></div>
              <div className="h-20 bg-secondary-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!ocrData || ocrData.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">OCR Data</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-secondary-500">
          <p className="text-center">No OCR data available</p>
          <p className="text-sm text-center mt-2">
            Upload and process financial documents to see extracted text
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900">OCR Data</h3>
        <div className="text-sm text-secondary-600">
          {ocrData.length} document{ocrData.length !== 1 ? 's' : ''} processed
        </div>
      </div>

      <div className="space-y-4">
        {ocrData.map((ocr) => (
          <div key={ocr.id} className="border border-secondary-200 rounded-lg p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h4 className="font-medium text-secondary-900 truncate">
                  {ocr.documentName}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(ocr.confidence)}`}>
                  {ocr.confidence.toFixed(1)}% confidence
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-secondary-500">
                  {formatDate(ocr.processedAt)}
                </span>
                {editingId !== ocr.id && (
                  <>
                    <button
                      onClick={() => handleStartEdit(ocr)}
                      className="text-secondary-400 hover:text-blue-600 transition-colors"
                      title="Edit OCR text"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onReprocessOCR(ocr.documentId)}
                      className="text-secondary-400 hover:text-green-600 transition-colors"
                      title="Reprocess OCR"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            {editingId === ocr.id ? (
              <div className="space-y-3">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full h-32 p-3 border border-secondary-300 rounded-md text-sm font-mono resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Edit the extracted text..."
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="btn-outline flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="btn-primary flex items-center"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-secondary-50 rounded-md p-3">
                <pre className="text-sm text-secondary-700 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                  {ocr.text || 'No text extracted'}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-secondary-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium text-secondary-900">
              {ocrData.reduce((sum, ocr) => sum + ocr.text.length, 0).toLocaleString()}
            </div>
            <div className="text-secondary-600">Total Characters</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-secondary-900">
              {(ocrData.reduce((sum, ocr) => sum + ocr.confidence, 0) / ocrData.length).toFixed(1)}%
            </div>
            <div className="text-secondary-600">Avg. Confidence</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-secondary-900">
              {ocrData.filter(ocr => ocr.confidence >= 80).length}
            </div>
            <div className="text-secondary-600">High Quality</div>
          </div>
        </div>
      </div>
    </div>
  )
}
