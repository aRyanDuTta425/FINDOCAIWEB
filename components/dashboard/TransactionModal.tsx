'use client'

import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'

interface Transaction {
  id?: string
  date: string
  description: string
  category: string
  amount: number
  type: 'income' | 'expense'
}

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (transaction: Transaction) => void
  transaction?: Transaction | null
  mode: 'add' | 'edit'
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Entertainment',
  'Education',
  'Travel',
  'Business',
  'Other'
]

export default function TransactionModal({
  isOpen,
  onClose,
  onSave,
  transaction,
  mode
}: TransactionModalProps) {
  const [formData, setFormData] = useState<Transaction>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Other',
    amount: 0,
    type: 'expense'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (transaction && mode === 'edit') {
      setFormData({
        id: transaction.id,
        date: new Date(transaction.date).toISOString().split('T')[0],
        description: transaction.description,
        category: transaction.category,
        amount: Math.abs(transaction.amount),
        type: transaction.type
      })
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: 'Other',
        amount: 0,
        type: 'expense'
      })
    }
  }, [transaction, mode, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">
            {mode === 'add' ? 'Add Transaction' : 'Edit Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  formData.type === 'income'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-secondary-50 border-secondary-200 text-secondary-600 hover:bg-secondary-100'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  formData.type === 'expense'
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-secondary-50 border-secondary-200 text-secondary-600 hover:bg-secondary-100'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-secondary-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-2">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Enter transaction description"
              className="input"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="input"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-secondary-700 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              className="input"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {mode === 'add' ? 'Add Transaction' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
