'use client'

import { motion } from 'framer-motion'

const shimmerVariants = {
  hidden: { x: '-100%' },
  visible: {
    x: '100%',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'easeInOut'
    }
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4
    }
  }
}

interface AnimatedLoadingSkeletonProps {
  className?: string
}

function ShimmerCard({ className = '' }: AnimatedLoadingSkeletonProps) {
  return (
    <motion.div
      variants={cardVariants}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden ${className}`}
    >
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="w-full bg-gray-200 rounded-full h-2"></div>
      </div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          variants={shimmerVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12"
        />
      </div>
    </motion.div>
  )
}

export function EnhancedDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="ml-2 w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="w-96 h-5 bg-gray-200 rounded animate-pulse"></div>
        </motion.div>

        {/* Summary Cards Skeleton */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[1, 2, 3, 4].map((i) => (
            <ShimmerCard key={i} />
          ))}
        </motion.div>

        {/* Charts Row Skeleton */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-8 mb-8"
        >
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden"
          >
            <div className="animate-pulse">
              <div className="w-32 h-6 bg-gray-200 rounded mb-6"></div>
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto"></div>
            </div>
            <motion.div
              variants={shimmerVariants}
              initial="hidden"
              animate="visible"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12"
            />
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden"
          >
            <div className="animate-pulse">
              <div className="w-32 h-6 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            <motion.div
              variants={shimmerVariants}
              initial="hidden"
              animate="visible"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12"
            />
          </motion.div>
        </motion.div>

        {/* Tables Row Skeleton */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-8 mb-8"
        >
          {[1, 2].map((tableIndex) => (
            <motion.div
              key={tableIndex}
              variants={cardVariants}
              className="bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="animate-pulse">
                  <div className="w-32 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3, 4, 5].map((rowIndex) => (
                    <div key={rowIndex} className="flex items-center space-x-4">
                      <div className="w-12 h-4 bg-gray-200 rounded"></div>
                      <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                      <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              <motion.div
                variants={shimmerVariants}
                initial="hidden"
                animate="visible"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export function AnimatedPageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedButton({ 
  children, 
  onClick, 
  className = '',
  disabled = false,
  variant = 'primary'
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
}) {
  const baseClasses = "relative overflow-hidden font-medium rounded-lg transition-all duration-200"
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
