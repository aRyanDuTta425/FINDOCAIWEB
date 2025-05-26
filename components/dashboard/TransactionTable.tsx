'use client'

import { useState } from 'react'
import { 
  Edit3, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  ArrowUpDown
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

export default function TransactionTable({
  transactions,
  loading,
  onEditTransaction,
  onDeleteTransaction,
  onAddTransaction
}: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [sortField, setSortField] = useState<'date' | 'amount' | 'description'>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

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
    'Business',
    'Other'
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Math.abs(amount))
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const filteredAndSortedTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory
      const matchesType = filterType === 'all' || transaction.type === filterType
      
      return matchesSearch && matchesCategory && matchesType
    })
    .sort((a, b) => {
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

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">Recent Transactions</h3>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
              <div className="h-4 bg-secondary-200 rounded w-1/3"></div>
              <div className="h-4 bg-secondary-200 rounded w-1/6"></div>
              <div className="h-4 bg-secondary-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 sm:mb-0">
          Recent Transactions
        </h3>
        <button
          onClick={onAddTransaction}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input w-full sm:w-48"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="input w-full sm:w-32"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-secondary-200">
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center text-sm font-medium text-secondary-600 hover:text-secondary-900"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Date
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('description')}
                  className="flex items-center text-sm font-medium text-secondary-600 hover:text-secondary-900"
                >
                  Description
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium text-secondary-600">Category</span>
              </th>
              <th className="text-right py-3 px-4">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center justify-end text-sm font-medium text-secondary-600 hover:text-secondary-900"
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  Amount
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <span className="text-sm font-medium text-secondary-600">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-secondary-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredAndSortedTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="py-3 px-4">
                    <div className="text-sm text-secondary-900">
                      {formatDate(transaction.date)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-secondary-900">
                      {transaction.description}
                    </div>
                    {transaction.source && (
                      <div className="text-xs text-secondary-500 mt-1">
                        From {transaction.source === 'OCR' ? 'document scan' : 'manual entry'}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEditTransaction(transaction)}
                        className="text-secondary-400 hover:text-blue-600 transition-colors"
                        title="Edit transaction"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className="text-secondary-400 hover:text-red-600 transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {filteredAndSortedTransactions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-secondary-200">
          <div className="flex justify-between text-sm">
            <span className="text-secondary-600">
              Showing {filteredAndSortedTransactions.length} of {transactions.length} transactions
            </span>
            <div className="flex space-x-4">
              <span className="text-green-600">
                Income: {formatCurrency(
                  filteredAndSortedTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </span>
              <span className="text-red-600">
                Expenses: {formatCurrency(
                  filteredAndSortedTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
