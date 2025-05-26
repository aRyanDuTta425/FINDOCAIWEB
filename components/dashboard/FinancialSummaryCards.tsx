'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import lucide icons to avoid webpack issues
const TrendingUp = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: false })
const TrendingDown = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingDown })), { ssr: false })
const DollarSign = dynamic(() => import('lucide-react').then(mod => ({ default: mod.DollarSign })), { ssr: false })
const PiggyBank = dynamic(() => import('lucide-react').then(mod => ({ default: mod.PiggyBank })), { ssr: false })
const AlertCircle = dynamic(() => import('lucide-react').then(mod => ({ default: mod.AlertCircle })), { ssr: false })
const ArrowUpRight = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ArrowUpRight })), { ssr: false })
const ArrowDownRight = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ArrowDownRight })), { ssr: false })

interface FinancialData {
  healthScore: number
  totalIncome: number
  totalExpenses: number
  netSavings: number
  monthlyChange: {
    income: number
    expenses: number
    savings: number
  }
}

interface FinancialSummaryCardsProps {
  data: FinancialData
  loading?: boolean
}

export default function FinancialSummaryCards({ data, loading }: FinancialSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-secondary-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-secondary-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Financial Health Score */}
      <div className={`card ${getHealthScoreBg(data.healthScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Health Score</p>
            <p className={`text-3xl font-bold ${getHealthScoreColor(data.healthScore)}`}>
              {data.healthScore}
            </p>
            <p className="text-xs text-secondary-500 mt-1">
              {data.healthScore >= 80 ? 'Excellent' : 
               data.healthScore >= 60 ? 'Good' : 'Needs Attention'}
            </p>
          </div>
          <div className={`p-3 rounded-full ${getHealthScoreBg(data.healthScore)}`}>
            {data.healthScore >= 80 ? (
              <TrendingUp className={`h-6 w-6 ${getHealthScoreColor(data.healthScore)}`} />
            ) : data.healthScore >= 60 ? (
              <AlertCircle className={`h-6 w-6 ${getHealthScoreColor(data.healthScore)}`} />
            ) : (
              <TrendingDown className={`h-6 w-6 ${getHealthScoreColor(data.healthScore)}`} />
            )}
          </div>
        </div>
      </div>

      {/* Total Income */}
      <div className="card bg-green-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Total Income</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(data.totalIncome)}
            </p>
            <div className="flex items-center mt-1">
              {data.monthlyChange.income > 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <p className={`text-xs ${data.monthlyChange.income > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(data.monthlyChange.income)} this month
              </p>
            </div>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="card bg-red-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(data.totalExpenses)}
            </p>
            <div className="flex items-center mt-1">
              {data.monthlyChange.expenses > 0 ? (
                <ArrowUpRight className="h-3 w-3 text-red-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-green-500 mr-1" />
              )}
              <p className={`text-xs ${data.monthlyChange.expenses > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {formatPercentage(data.monthlyChange.expenses)} this month
              </p>
            </div>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <DollarSign className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Net Savings */}
      <div className="card bg-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">Net Savings</p>
            <p className={`text-3xl font-bold ${data.netSavings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(data.netSavings)}
            </p>
            <div className="flex items-center mt-1">
              {data.monthlyChange.savings > 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <p className={`text-xs ${data.monthlyChange.savings > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(data.monthlyChange.savings)} this month
              </p>
            </div>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <PiggyBank className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  )
}
