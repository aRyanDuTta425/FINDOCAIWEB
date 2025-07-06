'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Brain, 
  Shield, 
  Upload, 
  BarChart3, 
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Clock,
  Lock,
  TrendingUp,
  Menu,
  X
} from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      {/* Enhanced Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-secondary-900">FinDocAI</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Pricing
              </Link>
              <Link href="#resources" className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Resources
              </Link>
              <Link href="/contact" className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contact
              </Link>
            </div>

            <div className="hidden md:flex space-x-4">
              <Link
                href="/login"
                className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="btn-primary"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-secondary-600 hover:text-secondary-900 p-2 rounded-md"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-secondary-200 py-4">
              <div className="flex flex-col space-y-2">
                <Link href="#features" className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium">
                  Features
                </Link>
                <Link href="/pricing" className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium">
                  Pricing
                </Link>
                <Link href="#resources" className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium">
                  Resources
                </Link>
                <Link href="/contact" className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium">
                  Contact
                </Link>
                <div className="border-t border-secondary-200 pt-2 mt-2">
                  <Link href="/login" className="block text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                  <Link href="/signup" className="block btn-primary mt-2">
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Financial
            <span className="text-primary-600 block">Document Intelligence</span>
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your financial document processing with advanced OCR and AI analysis. 
            Extract insights from invoices, bank statements, and tax documents instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup" className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-shadow">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/demo" className="btn-outline text-lg px-8 py-3">
              View Demo
            </Link>
          </div>

          {/* Trust Building - Trusted By Section */}
          <div className="mt-16">
            <p className="text-sm text-secondary-500 mb-6 uppercase tracking-wider">Trusted by Financial Professionals</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* Placeholder company logos */}
              <div className="bg-secondary-200 rounded-lg px-6 py-3 text-secondary-600 font-semibold">AccountingFirm Pro</div>
              <div className="bg-secondary-200 rounded-lg px-6 py-3 text-secondary-600 font-semibold">TaxExperts Inc</div>
              <div className="bg-secondary-200 rounded-lg px-6 py-3 text-secondary-600 font-semibold">FinanceFlow</div>
              <div className="bg-secondary-200 rounded-lg px-6 py-3 text-secondary-600 font-semibold">BookKeeper Solutions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Powerful Features for Financial Professionals
          </h2>
          <p className="text-xl text-secondary-600">
            Everything you need to process and analyze financial documents
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card text-center hover:shadow-xl transition-shadow">
            <Upload className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Smart Upload
            </h3>
            <p className="text-secondary-600">
              Drag-and-drop interface with support for images and PDFs. 
              Secure cloud storage with instant processing.
            </p>
          </div>

          <div className="card text-center hover:shadow-xl transition-shadow">
            <Brain className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              AI Analysis
            </h3>
            <p className="text-secondary-600">
              Advanced machine learning algorithms extract key information 
              from invoices, statements, and tax documents.
            </p>
          </div>

          <div className="card text-center hover:shadow-xl transition-shadow">
            <BarChart3 className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Smart Insights
            </h3>
            <p className="text-secondary-600">
              Get detailed analysis and categorization with confidence scores 
              and actionable insights for better decision making.
            </p>
          </div>

          <div className="card text-center hover:shadow-xl transition-shadow">
            <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Enterprise Security
            </h3>
            <p className="text-secondary-600">
              Bank-grade encryption and secure authentication. 
              Your financial data is protected at every step.
            </p>
          </div>

          <div className="card text-center hover:shadow-xl transition-shadow">
            <FileText className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              OCR Technology
            </h3>
            <p className="text-secondary-600">
              State-of-the-art optical character recognition with high accuracy 
              for both handwritten and printed text.
            </p>
          </div>

          <div className="card text-center hover:shadow-xl transition-shadow">
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

        {/* Additional CTA */}
        <div className="text-center mt-12">
          <Link href="/signup" className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-shadow">
            Start Free Trial Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Why FinDocAI Over Others Section */}
      <section className="bg-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Why FinDocAI Over Others?
            </h2>
            <p className="text-xl text-secondary-600">
              See how we outperform the competition in what matters most
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">99.5% Accuracy</h3>
              <p className="text-secondary-600 text-sm">vs. 85-90% industry average</p>
              <div className="mt-2">
                <span className="text-green-600 font-semibold">✓ FinDocAI</span>
                <br />
                <span className="text-red-500">✗ Others</span>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">3-Second Processing</h3>
              <p className="text-secondary-600 text-sm">vs. 30+ seconds with competitors</p>
              <div className="mt-2">
                <span className="text-green-600 font-semibold">✓ FinDocAI</span>
                <br />
                <span className="text-red-500">✗ Others</span>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">SOC 2 Compliant</h3>
              <p className="text-secondary-600 text-sm">Enterprise-grade security included</p>
              <div className="mt-2">
                <span className="text-green-600 font-semibold">✓ FinDocAI</span>
                <br />
                <span className="text-red-500">✗ Most Others</span>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Zero Setup Time</h3>
              <p className="text-secondary-600 text-sm">Start processing immediately</p>
              <div className="mt-2">
                <span className="text-green-600 font-semibold">✓ FinDocAI</span>
                <br />
                <span className="text-red-500">✗ Others</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            What Financial Professionals Say
          </h2>
          <p className="text-xl text-secondary-600">
            Trusted by accountants, CFOs, and financial analysts worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-secondary-600 mb-4 italic">
              "FinDocAI reduced our invoice processing time by 85%. What used to take our team 
              hours now takes minutes. The accuracy is phenomenal."
            </blockquote>
            <div className="font-semibold text-secondary-900">Sarah Chen</div>
            <div className="text-sm text-secondary-500">CFO, TechFlow Solutions</div>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-secondary-600 mb-4 italic">
              "As a CPA firm, accuracy is everything. FinDocAI's AI extraction is more reliable 
              than manual entry and saves us countless hours during tax season."
            </blockquote>
            <div className="font-semibold text-secondary-900">Michael Rodriguez</div>
            <div className="text-sm text-secondary-500">Senior Partner, Rodriguez & Associates CPA</div>
          </div>

          <div className="card text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-secondary-600 mb-4 italic">
              "The security features and compliance tools give us peace of mind when handling 
              sensitive financial documents. It's enterprise-grade at startup prices."
            </blockquote>
            <div className="font-semibold text-secondary-900">Emily Thompson</div>
            <div className="text-sm text-secondary-500">Financial Controller, GlobalCorp Inc</div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="text-center mt-12">
          <p className="text-sm text-secondary-500 mb-4">Rated 4.9/5 on</p>
          <div className="flex justify-center items-center space-x-8">
            <div className="bg-secondary-100 rounded-lg px-4 py-2 text-secondary-600 font-medium">★★★★★ G2</div>
            <div className="bg-secondary-100 rounded-lg px-4 py-2 text-secondary-600 font-medium">★★★★★ Trustpilot</div>
            <div className="bg-secondary-100 rounded-lg px-4 py-2 text-secondary-600 font-medium">★★★★★ Capterra</div>
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
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
                <Link href="/signup" className="btn-primary text-lg px-8 py-3 inline-flex items-center shadow-lg hover:shadow-xl transition-shadow">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <p className="text-sm text-secondary-500 mt-4">No credit card required • 14-day free trial</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-secondary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-primary-400" />
                <span className="ml-2 text-xl font-bold">FinDocAI</span>
              </div>
              <p className="text-secondary-400 mb-4">
                AI-powered financial document intelligence for modern businesses.
              </p>
              <Link href="/signup" className="btn-primary">
                Start Free Trial
              </Link>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#features" className="hover:text-white transition-colors cursor-pointer">Features</a></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo-login" className="hover:text-white transition-colors">Demo</Link></li>
                <li><span className="text-secondary-500 cursor-not-allowed">API (Coming Soon)</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><span className="text-secondary-500 cursor-not-allowed">Documentation (Coming Soon)</span></li>
                <li><span className="text-secondary-500 cursor-not-allowed">Blog (Coming Soon)</span></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Support</Link></li>
                <li><span className="text-secondary-500 cursor-not-allowed">Guides (Coming Soon)</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><span className="text-secondary-500 cursor-not-allowed">Careers (Coming Soon)</span></li>
                <li><span className="text-secondary-500 cursor-not-allowed">Privacy (Coming Soon)</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-secondary-400 mb-4 md:mb-0">
                © 2025 FinDocAI. All rights reserved.
              </p>
              <div className="flex space-x-6 text-secondary-400">
                <span className="text-secondary-500 cursor-not-allowed">Privacy Policy (Coming Soon)</span>
                <span className="text-secondary-500 cursor-not-allowed">Terms of Service (Coming Soon)</span>
                <span className="text-secondary-500 cursor-not-allowed">Security (Coming Soon)</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
