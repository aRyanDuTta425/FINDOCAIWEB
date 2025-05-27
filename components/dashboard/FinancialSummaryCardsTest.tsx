'use client'

import React from 'react'
import { motion } from 'framer-motion'

// Enhanced test component with animations
export default function FinancialSummaryCardsTest() {
  const cards = [
    {
      title: 'Total Income',
      value: '$8,950',
      change: '+5.2%',
      trend: 'up',
      color: 'bg-green-500'
    },
    {
      title: 'Total Expenses',
      value: '$2,840',
      change: '-2.1%',
      trend: 'down',
      color: 'bg-blue-500'
    },
    {
      title: 'Net Savings',
      value: '$6,110',
      change: '+8.7%',
      trend: 'up',
      color: 'bg-purple-500'
    }
  ]

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
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Financial Dashboard</h1>
        <p className="text-gray-600">Test component demonstrating animated financial summary cards</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover="hover"
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${
                    card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <div className="w-6 h-6 bg-white bg-opacity-30 rounded"></div>
              </div>
            </div>
            
            {/* Progress bar animation */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${card.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Component Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">✨ Animations</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Staggered card animations</li>
              <li>• Hover effects with scale & lift</li>
              <li>• Progress bar animations</li>
              <li>• Smooth page transitions</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">🎯 Enhanced UX</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Document filtering capability</li>
              <li>• Real-time data updates</li>
              <li>• Loading state animations</li>
              <li>• Interactive components</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
