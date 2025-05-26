'use client'

import { 
  TrendingUp, 
  PiggyBank, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'

interface Recommendation {
  id: string
  type: 'success' | 'warning' | 'info' | 'tip'
  title: string
  description: string
  action?: string
  priority: 'high' | 'medium' | 'low'
}

interface RecommendationsSectionProps {
  recommendations: Recommendation[]
  loading?: boolean
}

export default function RecommendationsSection({ recommendations, loading }: RecommendationsSectionProps) {
  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">Financial Recommendations</h3>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-secondary-200 rounded-lg p-4">
              <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-secondary-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
      case 'tip':
        return <TrendingUp className="h-5 w-5 text-purple-600" />
      default:
        return <Info className="h-5 w-5 text-secondary-600" />
    }
  }

  const getRecommendationBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      case 'tip':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-secondary-50 border-secondary-200'
    }
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return colors[priority as keyof typeof colors] || colors.low
  }

  // Default recommendations if none provided
  const defaultRecommendations: Recommendation[] = [
    {
      id: '1',
      type: 'tip',
      title: 'Start Tracking Your Expenses',
      description: 'Upload your bank statements and receipts to get a complete picture of your spending habits.',
      action: 'Upload documents',
      priority: 'high'
    },
    {
      id: '2',
      type: 'info',
      title: 'Set Up Categories',
      description: 'Organize your transactions into categories to better understand where your money goes.',
      action: 'Categorize transactions',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'success',
      title: 'Enable OCR Processing',
      description: 'Our AI can automatically extract financial data from your documents for faster analysis.',
      action: 'Process documents',
      priority: 'medium'
    }
  ]

  const displayRecommendations = recommendations.length > 0 ? recommendations : defaultRecommendations

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Target className="h-5 w-5 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-secondary-900">Financial Recommendations</h3>
        </div>
        <div className="text-sm text-secondary-600">
          {displayRecommendations.length} recommendation{displayRecommendations.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-4">
        {displayRecommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className={`border rounded-lg p-4 ${getRecommendationBg(recommendation.type)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getRecommendationIcon(recommendation.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-secondary-900">
                      {recommendation.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(recommendation.priority)}`}>
                      {recommendation.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-secondary-700 mb-3">
                    {recommendation.description}
                  </p>
                  {recommendation.action && (
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                      {recommendation.action} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-secondary-200">
        <h4 className="text-sm font-medium text-secondary-900 mb-3">Quick Actions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button className="flex items-center justify-center p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
            <PiggyBank className="h-4 w-4 text-primary-600 mr-2" />
            <span className="text-sm font-medium text-secondary-700">Set Savings Goal</span>
          </button>
          <button className="flex items-center justify-center p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
            <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-secondary-700">View Reports</span>
          </button>
          <button className="flex items-center justify-center p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
            <Target className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-secondary-700">Budget Planner</span>
          </button>
        </div>
      </div>
    </div>
  )
}
