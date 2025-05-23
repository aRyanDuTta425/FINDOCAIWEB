'use client'

import { useState } from 'react'
import { 
  FileText, 
  Image, 
  Eye, 
  Scan, 
  Brain, 
  Download,
  Calendar,
  DollarSign,
  Building,
  CreditCard,
  Receipt,
  TrendingUp
} from 'lucide-react'
import { 
  formatFileSize, 
  formatDateTime, 
  formatDate, 
  formatCurrency,
  getDocumentTypeColor, 
  getDocumentTypeLabel 
} from '@/lib/utils'

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
    dueDate?: string
    vendor?: string
    accountNumber?: string
    balance?: number
    statementDate?: string
    taxYear?: number
    taxType?: string
    extractedData?: any
    [key: string]: any
  }
}

interface DocumentViewerProps {
  document: Document
  onProcessDocument: (documentId: string, type: 'ocr' | 'analyze') => void
}

export default function DocumentViewer({ document, onProcessDocument }: DocumentViewerProps) {
  const [processing, setProcessing] = useState<'ocr' | 'analyze' | null>(null)

  const handleProcess = async (type: 'ocr' | 'analyze') => {
    setProcessing(type)
    try {
      await onProcessDocument(document.id, type)
    } finally {
      setProcessing(null)
    }
  }

  const hasOCR = !!document.ocrData
  const hasAnalysis = !!document.analysisResult

  return (
    <div className="card space-y-6">
      {/* Document Header */}
      <div className="border-b border-secondary-200 pb-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {document.fileType.startsWith('image/') ? (
              <Image className="h-8 w-8 text-primary-600" />
            ) : (
              <FileText className="h-8 w-8 text-primary-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-secondary-900 truncate">
              {document.originalName}
            </h3>
            <div className="mt-1 text-sm text-secondary-500 space-y-1">
              <div>{formatFileSize(document.fileSize)}</div>
              <div>Uploaded {formatDateTime(document.uploadedAt)}</div>
            </div>
          </div>
        </div>

        {/* Document Type Badge */}
        {hasAnalysis && (
          <div className="mt-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDocumentTypeColor(
                document.analysisResult!.documentType
              )}`}
            >
              {getDocumentTypeLabel(document.analysisResult!.documentType)}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => window.open(document.fileUrl, '_blank')}
          className="btn-secondary flex items-center justify-center"
        >
          <Eye className="h-4 w-4 mr-2" />
          View File
        </button>
        <button
          onClick={() => {
            // Use window.document instead of document to disambiguate from the document object
            const link = window.document.createElement('a')
            link.href = document.fileUrl
            link.download = document.originalName
            link.click()
          }}
          className="btn-outline flex items-center justify-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </button>
      </div>

      {/* Processing Actions */}
      {!hasOCR && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="font-medium text-blue-900 mb-2">Text Extraction</h4>
          <p className="text-sm text-blue-700 mb-3">
            Extract text content from this document using OCR technology.
          </p>
          <button
            onClick={() => handleProcess('ocr')}
            disabled={!!processing}
            className="btn-primary text-sm"
          >
            {processing === 'ocr' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Scan className="h-4 w-4 mr-2" />
                Extract Text
              </>
            )}
          </button>
        </div>
      )}

      {hasOCR && !hasAnalysis && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h4 className="font-medium text-green-900 mb-2">AI Analysis</h4>
          <p className="text-sm text-green-700 mb-3">
            Analyze the extracted text to identify document type and extract key information.
          </p>
          <button
            onClick={() => handleProcess('analyze')}
            disabled={!!processing}
            className="btn-primary text-sm"
          >
            {processing === 'analyze' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyze Document
              </>
            )}
          </button>
        </div>
      )}

      {/* OCR Results */}
      {hasOCR && (
        <div className="space-y-4">
          <div className="border-t border-secondary-200 pt-4">
            <h4 className="font-medium text-secondary-900 mb-2">Extracted Text</h4>
            <div className="bg-secondary-50 rounded-md p-3">
              <div className="text-sm text-secondary-600 mb-2">
                Confidence: {(document.ocrData!.confidence * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-secondary-900 max-h-32 overflow-y-auto">
                {document.ocrData!.text}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {hasAnalysis && (
        <div className="space-y-4">
          <div className="border-t border-secondary-200 pt-4">
            <h4 className="font-medium text-secondary-900 mb-4">Analysis Results</h4>
            
            {/* Summary */}
            {document.analysisResult!.summary && (
              <div className="bg-primary-50 rounded-md p-3 mb-4">
                <h5 className="font-medium text-primary-900 mb-1">Summary</h5>
                <p className="text-sm text-primary-800">{document.analysisResult!.summary}</p>
                {document.analysisResult!.confidence && (
                  <p className="text-xs text-primary-600 mt-2">
                    Confidence: {(document.analysisResult!.confidence * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            )}

            {/* Document-specific fields */}
            <div className="space-y-3">
              {/* Invoice Fields */}
              {document.analysisResult!.documentType === 'invoice' && (
                <>
                  {document.analysisResult!.invoiceNumber && (
                    <div className="flex items-center justify-between py-2 border-b border-secondary-200">
                      <div className="flex items-center text-sm text-secondary-600">
                        <Receipt className="h-4 w-4 mr-2" />
                        Invoice Number
                      </div>
                      <div className="text-sm font-medium text-secondary-900">
                        {document.analysisResult!.invoiceNumber}
                      </div>
                    </div>
                  )}
                  {document.analysisResult!.amount && (
                    <div className="flex items-center justify-between py-2 border-b border-secondary-200">
                      <div className="flex items-center text-sm text-secondary-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Amount
                      </div>
                      <div className="text-sm font-medium text-secondary-900">
                        {formatCurrency(document.analysisResult!.amount)}
                      </div>
                    </div>
                  )}
                  {document.analysisResult!.vendor && (
                    <div className="flex items-center justify-between py-2 border-b border-secondary-200">
                      <div className="flex items-center text-sm text-secondary-600">
                        <Building className="h-4 w-4 mr-2" />
                        Vendor
                      </div>
                      <div className="text-sm font-medium text-secondary-900">
                        {document.analysisResult!.vendor}
                      </div>
                    </div>
                  )}
                  {document.analysisResult!.dueDate && (
                    <div className="flex items-center justify-between py-2 border-b border-secondary-200">
                      <div className="flex items-center text-sm text-secondary-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Due Date
                      </div>
                      <div className="text-sm font-medium text-secondary-900">
                        {formatDate(document.analysisResult!.dueDate)}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Bank Statement Fields */}
              {document.analysisResult!.documentType === 'bank_statement' && (
                <>
                  {document.analysisResult!.accountNumber && (
                    <div className="flex items-center justify-between py-2 border-b border-secondary-200">
                      <div className="flex items-center text-sm text-secondary-600">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Account Number
                      </div>
                      <div className="text-sm font-medium text-secondary-900">
                        {document.analysisResult!.accountNumber}
                      </div>
                    </div>
                  )}
                  {document.analysisResult!.balance && (
                    <div className="flex items-center justify-between py-2 border-b border-secondary-200">
                      <div className="flex items-center text-sm text-secondary-600">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Balance
                      </div>
                      <div className="text-sm font-medium text-secondary-900">
                        {formatCurrency(document.analysisResult!.balance)}
                      </div>
                    </div>
                  )}
                  {document.analysisResult!.statementDate && (
                    <div className="flex items-center justify-between py-2 border-b border-secondary-200">
                      <div className="flex items-center text-sm text-secondary-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Statement Date
                      </div>
                      <div className="text-sm font-medium text-secondary-900">
                        {formatDate(document.analysisResult!.statementDate)}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Tax Document Fields */}
              {document.analysisResult!.documentType === 'tax_document' && (
                <>
                  {document.analysisResult!.taxYear && (
                    <div className="flex items-center justify-between py-2 border-b border-secondary-200">
                      <div className="flex items-center text-sm text-secondary-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Tax Year
                      </div>
                      <div className="text-sm font-medium text-secondary-900">
                        {document.analysisResult!.taxYear}
                      </div>
                    </div>
                  )}
                  {document.analysisResult!.taxType && (
                    <div className="flex items-center justify-between py-2 border-b border-secondary-200">
                      <div className="flex items-center text-sm text-secondary-600">
                        <FileText className="h-4 w-4 mr-2" />
                        Document Type
                      </div>
                      <div className="text-sm font-medium text-secondary-900">
                        {document.analysisResult!.taxType}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Additional extracted data */}
            {document.analysisResult!.extractedData && (
              <div className="mt-4 bg-secondary-50 rounded-md p-3">
                <h5 className="font-medium text-secondary-900 mb-2">Additional Data</h5>
                <pre className="text-xs text-secondary-700 overflow-x-auto">
                  {JSON.stringify(document.analysisResult!.extractedData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
