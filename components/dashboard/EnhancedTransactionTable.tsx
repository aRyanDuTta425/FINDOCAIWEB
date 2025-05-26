'use client'

import { useState, useMemo } from 'react'
import { 
  Edit3, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  ArrowUpDown,
  Download,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: 'income' | 'expense'
  source?: string // OCR or manual entry
}

interface TransactionTableProps {
  transactions: Transaction[]
  loading?: boolean
  onEditTransaction: (transaction: Transaction) => void
  onDeleteTransaction: (id: string) => void
  onAddTransaction: () => void
}

interface FilterState {
  searchTerm: string
  category: string
  type: string
  dateRange: {
    start: string
    end: string
  }
  amountRange: {
    min: number
    max: number
  }
}

export default function EnhancedTransactionTable({
  transactions,
  loading,
  onEditTransaction,
  onDeleteTransaction,
  onAddTransaction
}: TransactionTableProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: 'all',
    type: 'all',
    dateRange: { start: '', end: '' },
    amountRange: { min: 0, max: 0 }
  })
  const [sortField, setSortField] = useState<'date' | 'amount' | 'description'>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const categories = [
    'all',
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Income',
    'Investment',
    'Other'
  ]

  // Calculate max amount for range filter
  const maxAmount = useMemo(() => {
    return Math.max(...transactions.map(t => Math.abs(t.amount)), 0)
  }, [transactions])

  // Update amount range when transactions change
  useMemo(() => {
    if (filters.amountRange.max === 0 && maxAmount > 0) {
      setFilters(prev => ({
        ...prev,
        amountRange: { min: 0, max: maxAmount }
      }))
    }
  }, [maxAmount, filters.amountRange.max])

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        if (
          !transaction.description.toLowerCase().includes(searchLower) &&
          !transaction.category.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      // Category filter
      if (filters.category !== 'all' && transaction.category !== filters.category) {
        return false
      }

      // Type filter
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false
      }

      // Date range filter
      if (filters.dateRange.start && transaction.date < filters.dateRange.start) {
        return false
      }
      if (filters.dateRange.end && transaction.date > filters.dateRange.end) {
        return false
      }

      // Amount range filter
      const amount = Math.abs(transaction.amount)
      if (amount < filters.amountRange.min || amount > filters.amountRange.max) {
        return false
      }

      return true
    })

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'amount':
          comparison = Math.abs(a.amount) - Math.abs(b.amount)
          break
        case 'description':
          comparison = a.description.localeCompare(b.description)
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [transactions, filters, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (field: 'date' | 'amount' | 'description') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'all',
      type: 'all',
      dateRange: { start: '', end: '' },
      amountRange: { min: 0, max: maxAmount }
    })
    setCurrentPage(1)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {filteredTransactions.length} of {transactions.length} transactions
            </span>
            <button
              onClick={onAddTransaction}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Search and Basic Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="input pl-10"
            />
          </div>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="input w-full sm:w-48"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="input w-full sm:w-32"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <Filter className="h-4 w-4 mr-1" />
            Advanced Filters
          </button>
          {(filters.searchTerm || filters.category !== 'all' || filters.type !== 'all' || 
            filters.dateRange.start || filters.dateRange.end) && (
            <button
              onClick={clearAllFilters}
              className="flex items-center text-sm text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="input"
                  />
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Range: ${filters.amountRange.min} - ${filters.amountRange.max}
                </label>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="0"
                    max={maxAmount}
                    value={filters.amountRange.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      amountRange: { ...prev.amountRange, min: Number(e.target.value) }
                    }))}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max={maxAmount}
                    value={filters.amountRange.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      amountRange: { ...prev.amountRange, max: Number(e.target.value) }
                    }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center">
                  Description
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">
                  Amount
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                  {transaction.source && (
                    <div className="text-xs text-gray-500">Source: {transaction.source}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditTransaction(transaction)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit transaction"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete transaction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="input py-1 px-2 text-sm w-20"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">per page</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
