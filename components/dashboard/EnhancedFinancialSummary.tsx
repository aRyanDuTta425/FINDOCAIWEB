'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Target, AlertCircle, Activity } from 'lucide-react'

interface EnhancedFinancialSummaryProps {
  data: {
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
  loading?: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  },
  hover: {
    y: -2,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
}

const progressVariants = {
  hidden: { width: 0 },
  visible: (width: number) => ({
    width: `${width}%`,
    transition: {
      duration: 1.5,
      ease: "easeOut",
      delay: 0.5
    }
  })
}

const numberVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.3
    }
  }
}

export default function EnhancedFinancialSummary({ data, loading = false }: EnhancedFinancialSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const savingsRate = data.totalIncome > 0 ? (data.netSavings / data.totalIncome) * 100 : 0

  const cards = [
    {
      title: "Financial Health",
      value: `${data.healthScore}/100`,
      subtitle: data.healthScore >= 80 ? "Excellent" : data.healthScore >= 60 ? "Good" : "Needs Attention",
      icon: Activity,
      color: getHealthColor(data.healthScore),
      bgColor: getHealthBgColor(data.healthScore),
      progress: data.healthScore,
      trend: null
    },
    {
      title: "Total Income",
      value: formatCurrency(data.totalIncome),
      subtitle: `${data.monthlyChange.income >= 0 ? '+' : ''}${data.monthlyChange.income.toFixed(1)}% this month`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      progress: null,
      trend: data.monthlyChange.income
    },
    {
      title: "Total Expenses",
      value: formatCurrency(data.totalExpenses),
      subtitle: `${data.monthlyChange.expenses >= 0 ? '+' : ''}${data.monthlyChange.expenses.toFixed(1)}% this month`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
      progress: null,
      trend: data.monthlyChange.expenses
    },
    {
      title: "Net Savings",
      value: formatCurrency(data.netSavings),
      subtitle: `${savingsRate.toFixed(1)}% savings rate`,
      icon: Target,
      color: data.netSavings >= 0 ? "text-blue-600" : "text-red-600",
      bgColor: data.netSavings >= 0 ? "bg-blue-100" : "bg-red-100",
      progress: Math.min(Math.max(savingsRate, 0), 100),
      trend: data.monthlyChange.savings
    }
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          variants={cardVariants}
          whileHover="hover"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-600 transform rotate-12 scale-150"></div>
          </div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className={`p-2 rounded-lg ${card.bgColor}`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </motion.div>
              {card.trend !== null && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`flex items-center text-sm font-medium ${
                    card.trend >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {card.trend >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {formatChange(card.trend)}
                </motion.div>
              )}
            </div>

            {/* Value */}
            <motion.div variants={numberVariants} className="mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            </motion.div>

            {/* Subtitle */}
            <p className="text-sm text-gray-600 mb-4">{card.subtitle}</p>

            {/* Progress Bar */}
            {card.progress !== null && (
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    custom={card.progress}
                    variants={progressVariants}
                    initial="hidden"
                    animate="visible"
                    className={`h-2 rounded-full ${
                      card.title === "Financial Health"
                        ? data.healthScore >= 80
                          ? 'bg-emerald-500'
                          : data.healthScore >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Title */}
            <p className="text-xs font-medium text-gray-500 mt-3 uppercase tracking-wider">
              {card.title}
            </p>
          </div>
        </motion.div>
      ))}

      {/* Additional Info Card */}
      {(data.documentsCount !== undefined || data.documentsWithData !== undefined) && (
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                className="p-2 bg-blue-100 rounded-lg"
                whileHover={{ scale: 1.1 }}
              >
                <DollarSign className="h-5 w-5 text-blue-600" />
              </motion.div>
              <div>
                <h4 className="font-semibold text-gray-900">Data Summary</h4>
                <p className="text-sm text-gray-600">
                  Processing {data.documentsCount || 0} documents, {data.documentsWithData || 0} with financial data
                </p>
              </div>
            </div>
            {data.documentsWithData === 0 && data.documentsCount && data.documentsCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center text-amber-600"
              >
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">No financial data extracted</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
