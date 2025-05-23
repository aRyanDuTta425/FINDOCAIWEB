'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Brain, 
  Shield, 
  Upload, 
  BarChart3, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-secondary-900">FinDocAI</span>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
            AI-Powered Financial
            <span className="text-primary-600 block">Document Intelligence</span>
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
            Transform your financial document processing with advanced OCR and AI analysis. 
            Extract insights from invoices, bank statements, and tax documents instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary text-lg px-8 py-3">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/demo" className="btn-outline text-lg px-8 py-3">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Powerful Features for Financial Professionals
          </h2>
          <p className="text-xl text-secondary-600">
            Everything you need to process and analyze financial documents
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card text-center">
            <Upload className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Smart Upload
            </h3>
            <p className="text-secondary-600">
              Drag-and-drop interface with support for images and PDFs. 
              Secure cloud storage with instant processing.
            </p>
          </div>

          <div className="card text-center">
            <Brain className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              AI Analysis
            </h3>
            <p className="text-secondary-600">
              Advanced machine learning algorithms extract key information 
              from invoices, statements, and tax documents.
            </p>
          </div>

          <div className="card text-center">
            <BarChart3 className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Smart Insights
            </h3>
            <p className="text-secondary-600">
              Get detailed analysis and categorization with confidence scores 
              and actionable insights for better decision making.
            </p>
          </div>

          <div className="card text-center">
            <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Enterprise Security
            </h3>
            <p className="text-secondary-600">
              Bank-grade encryption and secure authentication. 
              Your financial data is protected at every step.
            </p>
          </div>

          <div className="card text-center">
            <FileText className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              OCR Technology
            </h3>
            <p className="text-secondary-600">
              State-of-the-art optical character recognition with high accuracy 
              for both handwritten and printed text.
            </p>
          </div>

          <div className="card text-center">
            <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Team Collaboration
            </h3>
            <p className="text-secondary-600">
              Share documents and insights with your team. 
              Built for accountants, bookkeepers, and financial analysts.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                Why Choose FinDocAI?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-secondary-900">Save Time & Money</h3>
                    <p className="text-secondary-600">Reduce manual data entry by 90% and process documents 10x faster</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-secondary-900">Improve Accuracy</h3>
                    <p className="text-secondary-600">AI-powered extraction with 99%+ accuracy and confidence scoring</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-secondary-900">Scale Operations</h3>
                    <p className="text-secondary-600">Handle thousands of documents with automated processing pipelines</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-secondary-900">Ensure Compliance</h3>
                    <p className="text-secondary-600">Built-in audit trails and security features for regulatory compliance</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-secondary-900 mb-4">Ready to Get Started?</h3>
                <p className="text-secondary-600 mb-6">Join thousands of professionals who trust FinDocAI</p>
                <Link href="/signup" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FileText className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold">FinDocAI</span>
            </div>
            <p className="text-secondary-400">
              © 2025 FinDocAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
