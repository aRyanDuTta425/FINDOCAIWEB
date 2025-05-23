'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  FileText, 
  Upload, 
  LogOut, 
  Search, 
  Filter,
  Eye,
  Brain,
  Scan,
  Plus
} from 'lucide-react'
import FileUpload from '@/components/FileUpload'
import DocumentList from '@/components/DocumentList'
import DocumentViewer from '@/components/DocumentViewer'

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

export default function DashboardPage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loadingDocs, setLoadingDocs] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchDocuments()
    }
  }, [user])

  const fetchDocuments = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filterType !== 'all') params.append('type', filterType)

      const response = await fetch(`/api/documents?${params}`)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents)
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      setLoadingDocs(false)
    }
  }

  const handleUploadSuccess = (newDocument: Document) => {
    setDocuments(prev => [newDocument, ...prev])
    setShowUpload(false)
  }

  const handleProcessDocument = async (documentId: string, type: 'ocr' | 'analyze') => {
    try {
      const endpoint = type === 'ocr' ? '/api/ocr' : '/api/analyze'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId }),
      })

      if (response.ok) {
        // Refresh documents to get updated data
        fetchDocuments()
      }
    } catch (error) {
      console.error(`Failed to ${type} document:`, error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-secondary-900">FinDocAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-secondary-600">
                Welcome, {user?.name || user?.email}
              </span>
              <button
                onClick={logout}
                className="btn-outline flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Document Dashboard</h1>
              <p className="text-secondary-600">Manage and analyze your financial documents</p>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input w-full sm:w-48"
            >
              <option value="all">All Types</option>
              <option value="invoice">Invoices</option>
              <option value="bank_statement">Bank Statements</option>
              <option value="tax_document">Tax Documents</option>
              <option value="other">Other</option>
            </select>
            <button
              onClick={fetchDocuments}
              className="btn-secondary flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Document List */}
          <div className="lg:col-span-2">
            <DocumentList
              documents={documents}
              loading={loadingDocs}
              onSelectDocument={setSelectedDocument}
              onProcessDocument={handleProcessDocument}
            />
          </div>

          {/* Document Viewer/Details */}
          <div className="lg:col-span-1">
            {selectedDocument ? (
              <DocumentViewer
                document={selectedDocument}
                onProcessDocument={handleProcessDocument}
              />
            ) : (
              <div className="card text-center py-12">
                <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  No Document Selected
                </h3>
                <p className="text-secondary-600">
                  Select a document from the list to view details and analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <FileUpload
          onSuccess={handleUploadSuccess}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  )
}
