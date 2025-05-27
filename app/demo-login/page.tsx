'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function DemoLoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@findocai.com' })
      })

      const data = await response.json()
      
      if (data.success) {
        // Store the token (in a real app, use httpOnly cookies)
        localStorage.setItem('demo-token', data.token)
        localStorage.setItem('demo-user', JSON.stringify(data.user))
        
        // Redirect to dashboard
        router.push('/dashboard/financial')
      } else {
        alert('Demo login failed')
      }
    } catch (error) {
      console.error('Demo login error:', error)
      alert('Demo login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FindocAI Demo</h1>
          <p className="text-gray-600">Enhanced Financial Dashboard</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="bg-blue-50 rounded-lg p-4">
            <h2 className="font-semibold text-blue-900 mb-2">Demo Features</h2>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Animated financial summary cards</li>
              <li>• Document filtering by individual files</li>
              <li>• Enhanced UI with framer-motion</li>
              <li>• Realistic financial data</li>
              <li>• Interactive charts and tables</li>
            </ul>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Enter Demo Dashboard'
            )}
          </motion.button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Demo account: demo@findocai.com<br/>
              No password required for demo
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <div className="text-center">
            <h3 className="font-semibold text-gray-700 mb-2">Quick Test Links</h3>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => router.push('/test-components')}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                View Enhanced Components Test Page
              </button>
              <button
                onClick={() => router.push('/api/dashboard/financial-test')}
                className="text-sm text-green-600 hover:text-green-800 transition-colors"
              >
                Test API Endpoint (JSON)
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
