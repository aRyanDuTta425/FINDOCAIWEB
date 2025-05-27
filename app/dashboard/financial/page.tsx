'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  LogOut,
  TrendingUp,
  BarChart3,
  Receipt,
  Target,
  RefreshCw
} from 'lucide-react'

// Import dashboard components
import FinancialSummaryCards from '@/components/dashboard/FinancialSummaryCards'
import EnhancedFinancialSummary from '@/components/dashboard/EnhancedFinancialSummary'
import ExpenseCategoryChart from '@/components/dashboard/ExpenseCategoryChart'
import MonthlyTrendChart from '@/components/dashboard/MonthlyTrendChart'
import TransactionTable from '@/components/dashboard/EnhancedTransactionTable'
import EditableOCRPanel from '@/components/dashboard/EditableOCRPanel'
import RecommendationsSection from '@/components/dashboard/RecommendationsSection'
import TransactionModal from '@/components/dashboard/TransactionModal'
import ExportPanel from '@/components/dashboard/ExportPanel'
import EmbeddingManager from '@/components/dashboard/EmbeddingManager'
import NotificationSystem, { useNotifications } from '@/components/dashboard/NotificationSystem'
import { FullDashboardSkeleton } from '@/components/dashboard/LoadingSkeletons'
import { EnhancedDashboardSkeleton, AnimatedPageTransition, AnimatedButton } from '@/components/ui/AnimatedComponents'
import { DocumentSelector } from '@/components/dashboard/DocumentSelector'
import MobileNav from '@/components/MobileNav'
import RetryWrapper from '@/components/RetryWrapper'
import { useAppStability } from '@/hooks/useAppStability'
import { apiCall } from '@/lib/api'

interface FinancialData {
  summary: {
    healthScore: number
    totalIncome: number
    totalExpenses: number
    netSavings: number
    monthlyChange: {
      income: number
      expenses: number
      savings: number
    }
    documentsCount?: number
    documentsWithData?: number
  }
  expenseCategories: Array<{
    name: string
    value: number
    percentage: number
    color: string
  }>
  monthlyTrends: Array<{
    month: string
    income: number
    expenses: number
    savings: number
  }>
  transactions: Array<{
    id: string
    documentId?: string
    date: string
    description: string
    category: string
    amount: number
    type: 'income' | 'expense'
    source?: string
    filename?: string
    documentType?: string
  }>
  recommendations: Array<{
    id: string
    type: 'success' | 'warning' | 'info' | 'tip'
    title: string
    description: string
    action?: string
    priority: 'high' | 'medium' | 'low'
  }>
  documents?: Array<{
    id: string
    filename: string
    uploadedAt: string
    hasAnalysisResult: boolean
    documentType?: string
    amount: number
  }>
  debug?: {
    totalDocuments: number
    documentsWithAnalysis: number
    documentsWithAmount: number
  }
}

interface OCRData {
  id: string
  text: string
  confidence: number
  processedAt: string
  documentId: string
  documentName: string
}

export default function FinancialDashboard() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const { notifications, addNotification, removeNotification } = useNotifications()
  
  // Enable app stability features (service worker + chunk error handling)
  useAppStability()
  
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [ocrData, setOcrData] = useState<OCRData[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  
  // Transaction modal state
  const [transactionModal, setTransactionModal] = useState<{
    isOpen: boolean
    mode: 'add' | 'edit'
    transaction?: any
  }>({
    isOpen: false,
    mode: 'add'
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user, selectedDocumentId]) // Re-load data when document selection changes

  const loadDashboardData = async () => {
    try {
      setLoadingData(true)
      
      // Build API URL with document filter if selected
      const apiUrl = selectedDocumentId 
        ? `/api/dashboard/financial-by-document?documentId=${selectedDocumentId}`
        : '/api/dashboard/financial-by-document'
      
      // Load financial data using the authenticated API utility
      try {
        const financialData = await apiCall(apiUrl)
        setFinancialData(financialData)
        
        // Show debug info if available
        if (financialData.debug) {
          console.log('Financial Data Debug:', financialData.debug)
          if (financialData.debug.documentsWithAmount === 0 && financialData.debug.totalDocuments > 0) {
            addNotification({
              type: 'warning',
              title: 'No financial data found',
              message: `Found ${financialData.debug.totalDocuments} documents but none contain extractable financial amounts. Please ensure your documents contain clear financial information.`,
              duration: 8000
            })
          }
        }
      } catch (error) {
        console.error('Failed to load financial data:', error)
        addNotification({
          type: 'error',
          title: 'Failed to load financial data',
          message: 'Please try refreshing the page or contact support if the issue persists.',
          duration: 5000
        })
      }
      
      // Load OCR data using the authenticated API utility
      try {
        const ocrData = await apiCall('/api/dashboard/ocr')
        setOcrData(ocrData.ocrData)
      } catch (error) {
        console.error('Failed to load OCR data:', error)
        addNotification({
          type: 'warning',
          title: 'OCR data unavailable',
          message: 'Some features may be limited.',
          duration: 3000
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      addNotification({
        type: 'error',
        title: 'Connection error',
        message: 'Unable to connect to the server. Please check your internet connection.',
        duration: 5000
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
    addNotification({
      type: 'success',
      title: 'Data refreshed',
      message: 'Your financial data has been updated.',
      duration: 2000
    })
  }

  const handleEditTransaction = (transaction: any) => {
    setTransactionModal({
      isOpen: true,
      mode: 'edit',
      transaction
    })
  }

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return

    try {
      const response = await fetch(`/api/dashboard/transactions?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadDashboardData() // Refresh data
        addNotification({
          type: 'success',
          title: 'Transaction deleted',
          message: 'The transaction has been successfully removed.',
          duration: 3000
        })
      } else {
        addNotification({
          type: 'error',
          title: 'Delete failed',
          message: 'Unable to delete the transaction. Please try again.',
          duration: 5000
        })
      }
    } catch (error) {
      console.error('Error deleting transaction:', error)
      addNotification({
        type: 'error',
        title: 'Connection error',
        message: 'Unable to delete transaction due to network issues.',
        duration: 5000
      })
    }
  }

  const handleAddTransaction = () => {
    setTransactionModal({
      isOpen: true,
      mode: 'add'
    })
  }

  const handleSaveTransaction = async (transactionData: any) => {
    try {
      const isEdit = transactionModal.mode === 'edit'
      const url = '/api/dashboard/transactions'
      const method = isEdit ? 'PUT' : 'POST'
      
      const payload = isEdit 
        ? { ...transactionData, transactionId: transactionModal.transaction?.id }
        : transactionData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await loadDashboardData() // Refresh data
        setTransactionModal({ isOpen: false, mode: 'add' })
        addNotification({
          type: 'success',
          title: isEdit ? 'Transaction updated' : 'Transaction added',
          message: `Transaction has been successfully ${isEdit ? 'updated' : 'added'}.`,
          duration: 3000
        })
      } else {
        addNotification({
          type: 'error',
          title: 'Save failed',
          message: 'Unable to save the transaction. Please try again.',
          duration: 5000
        })
      }
    } catch (error) {
      console.error('Error saving transaction:', error)
      addNotification({
        type: 'error',
        title: 'Connection error',
        message: 'Unable to save transaction due to network issues.',
        duration: 5000
      })
    }
  }

  const handleUpdateOCR = async (ocrId: string, newText: string) => {
    try {
      const response = await fetch('/api/dashboard/ocr', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ocrId, newText })
      })

      if (response.ok) {
        await loadDashboardData() // Refresh data
        addNotification({
          type: 'success',
          title: 'OCR data updated',
          message: 'The text has been successfully corrected.',
          duration: 3000
        })
      } else {
        addNotification({
          type: 'error',
          title: 'Update failed',
          message: 'Unable to update OCR data. Please try again.',
          duration: 5000
        })
      }
    } catch (error) {
      console.error('Error updating OCR:', error)
      addNotification({
        type: 'error',
        title: 'Connection error',
        message: 'Unable to update OCR data due to network issues.',
        duration: 5000
      })
    }
  }

  const handleReprocessOCR = async (documentId: string) => {
    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ documentId })
      })

      if (response.ok) {
        await loadDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Error reprocessing OCR:', error)
    }
  }

  if (loading || loadingData) {
    return <EnhancedDashboardSkeleton />
  }

  return (
    <RetryWrapper onRetry={loadDashboardData}>
      <AnimatedPageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          {/* Notification System */}
          <NotificationSystem 
            notifications={notifications} 
            onRemove={removeNotification} 
          />
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-secondary-900">FinDocAI</span>
              <nav className="hidden md:flex ml-8 space-x-6">
                <Link href="/dashboard" className="text-primary-600 font-medium">Dashboard</Link>
                <Link href="/dashboard/documents" className="text-secondary-600 hover:text-secondary-900">Documents</Link>
                <Link href="/chat" className="text-secondary-600 hover:text-secondary-900">Chat</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <AnimatedButton
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="p-2"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </AnimatedButton>
              <span className="hidden sm:inline text-sm text-secondary-600">
                Welcome, {user?.name || user?.email}
              </span>
              <AnimatedButton
                onClick={logout}
                variant="outline"
                className="hidden md:flex items-center px-4 py-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </AnimatedButton>
              <MobileNav 
                currentPage="financial" 
                userName={user?.name || user?.email}
                onLogout={logout}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Financial Dashboard</h1>
          <p className="text-secondary-600 mt-2">
            Get insights into your financial health and manage your documents
          </p>
        </div>

        {/* Document Selector */}
        {financialData?.documents && financialData.documents.length > 0 && (
          <div className="mb-8">
            <DocumentSelector
              documents={financialData.documents}
              selectedDocumentId={selectedDocumentId || undefined}
              onDocumentSelect={setSelectedDocumentId}
            />
          </div>
        )}

        {/* Debug Info */}
        {financialData?.debug && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">📊 Data Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total Documents:</span>
                <span className="ml-2 font-medium">{financialData.debug.totalDocuments}</span>
              </div>
              <div>
                <span className="text-blue-700">With Analysis:</span>
                <span className="ml-2 font-medium">{financialData.debug.documentsWithAnalysis}</span>
              </div>
              <div>
                <span className="text-blue-700">With Financial Data:</span>
                <span className="ml-2 font-medium">{financialData.debug.documentsWithAmount}</span>
              </div>
            </div>
            {selectedDocumentId && (
              <div className="mt-2 text-xs text-blue-600">
                Showing data for selected document only
              </div>
            )}
          </div>
        )}

        {/* Financial Summary Cards */}
        <EnhancedFinancialSummary 
          data={financialData?.summary || {
            healthScore: 0,
            totalIncome: 0,
            totalExpenses: 0,
            netSavings: 0,
            monthlyChange: { income: 0, expenses: 0, savings: 0 },
            documentsCount: financialData?.documents?.length || 0,
            documentsWithData: financialData?.debug?.documentsWithAmount || 0
          }}
          loading={loadingData}
        />

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <ExpenseCategoryChart 
            data={financialData?.expenseCategories || []}
            loading={loadingData}
          />
          <MonthlyTrendChart 
            data={financialData?.monthlyTrends || []}
            loading={loadingData}
          />
        </div>

        {/* Transactions and OCR Row */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <TransactionTable
            transactions={financialData?.transactions || []}
            loading={loadingData}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onAddTransaction={handleAddTransaction}
          />
          
          <EditableOCRPanel
            ocrData={ocrData}
            loading={loadingData}
            onUpdateOCR={handleUpdateOCR}
            onReprocessOCR={handleReprocessOCR}
          />
        </div>

        {/* Recommendations and Export */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecommendationsSection 
            recommendations={financialData?.recommendations || []}
            loading={loadingData}
          />
          
          {financialData && (
            <ExportPanel financialData={{
              summary: {
                healthScore: financialData.summary.healthScore,
                totalIncome: financialData.summary.totalIncome,
                totalExpenses: financialData.summary.totalExpenses,
                netSavings: financialData.summary.netSavings,
                savingsRate: financialData.summary.netSavings / financialData.summary.totalIncome || 0,
                expenseRatio: financialData.summary.totalExpenses / financialData.summary.totalIncome || 0
              },
              transactions: financialData.transactions.map(t => ({
                id: t.id,
                date: t.date,
                description: t.description,
                amount: t.amount,
                category: t.category,
                type: t.type
              })),
              monthlyTrends: financialData.monthlyTrends,
              expenseCategories: financialData.expenseCategories,
              generatedAt: new Date().toISOString()
            }} />
          )}
        </div>

        {/* Embedding Management Section */}
        <div className="mb-8">
          <EmbeddingManager />
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={transactionModal.isOpen}
        mode={transactionModal.mode}
        transaction={transactionModal.transaction}
        onClose={() => setTransactionModal({ isOpen: false, mode: 'add' })}
        onSave={handleSaveTransaction}
      />
      </div>
      </AnimatedPageTransition>
    </RetryWrapper>
  )
}
