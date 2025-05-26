'use client'

interface SkeletonProps {
  className?: string
  width?: string
  height?: string
}

function Skeleton({ className = '', width = 'w-full', height = 'h-4' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${width} ${height} ${className}`} />
  )
}

export function FinancialSummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton width="w-8" height="h-8" />
            <Skeleton width="w-16" height="h-6" />
          </div>
          <Skeleton width="w-24" height="h-8" className="mb-2" />
          <Skeleton width="w-32" height="h-6" />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton width="w-32" height="h-6" className="mb-2" />
          <Skeleton width="w-48" height="h-4" />
        </div>
        <Skeleton width="w-20" height="h-8" />
      </div>
      <div className="relative h-80">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 border-4 border-gray-200 rounded-full flex items-center justify-center">
            <Skeleton width="w-24" height="h-24" className="rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Skeleton width="w-40" height="h-6" />
          <Skeleton width="w-24" height="h-8" />
        </div>
        <div className="flex gap-4">
          <Skeleton width="w-64" height="h-10" />
          <Skeleton width="w-32" height="h-10" />
          <Skeleton width="w-32" height="h-10" />
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-4">
                <Skeleton width="w-10" height="h-10" className="rounded-full" />
                <div>
                  <Skeleton width="w-32" height="h-4" className="mb-1" />
                  <Skeleton width="w-24" height="h-3" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton width="w-20" height="h-4" className="mb-1" />
                <Skeleton width="w-16" height="h-3" />
              </div>
              <Skeleton width="w-20" height="h-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function RecommendationsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton width="w-40" height="h-6" />
        <Skeleton width="w-24" height="h-6" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <Skeleton width="w-6" height="h-6" className="rounded-full mt-1" />
            <div className="flex-1">
              <Skeleton width="w-48" height="h-5" className="mb-2" />
              <Skeleton width="w-full" height="h-4" className="mb-1" />
              <Skeleton width="w-3/4" height="h-4" />
            </div>
            <Skeleton width="w-16" height="h-6" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function FullDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Skeleton width="w-48" height="h-8" className="mb-2" />
              <Skeleton width="w-64" height="h-4" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton width="w-32" height="h-10" />
              <Skeleton width="w-24" height="h-10" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards Skeleton */}
        <FinancialSummaryCardsSkeleton />

        {/* Charts Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        {/* Transaction Table Skeleton */}
        <div className="mb-8">
          <TableSkeleton />
        </div>

        {/* Recommendations Skeleton */}
        <RecommendationsSkeleton />
      </div>
    </div>
  )
}

export default Skeleton
