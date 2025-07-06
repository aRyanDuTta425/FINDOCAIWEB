'use client'

import Link from 'next/link'
import { FileText, Target, Globe, Shield, TrendingUp, Heart, Award } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: 'Security First',
      description: 'Your data security is our top priority. We maintain enterprise-grade security standards and compliance.'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary-600" />,
      title: 'Innovation',
      description: 'We stay at the forefront of AI technology to provide you with the most advanced document processing capabilities.'
    },
    {
      icon: <Heart className="h-8 w-8 text-primary-600" />,
      title: 'Transparency',
      description: 'Clear pricing, honest communication, and transparent processes. No hidden fees or complex contracts.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-secondary-900">FinDocAI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-secondary-600 hover:text-secondary-900">
                Log In
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              About FinDocAI
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-8">
              We're transforming how businesses handle financial documents through the power of artificial intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Our Story
              </h2>
              <p className="text-secondary-700 mb-6">
                FinDocAI was created to solve the time-consuming challenge of manual financial document processing. 
                We combine cutting-edge AI technology with financial expertise to deliver accurate, reliable results.
              </p>
              <p className="text-secondary-700 mb-6">
                Our platform helps businesses save time, reduce errors, and unlock valuable insights from their 
                financial documents, allowing them to focus on what matters most - growing their business.
              </p>
              <p className="text-secondary-700">
                Today, we serve businesses worldwide, processing documents with industry-leading accuracy 
                and helping organizations streamline their financial operations.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">1,000+</div>
                  <div className="text-secondary-600">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">99.8%</div>
                  <div className="text-secondary-600">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">10M+</div>
                  <div className="text-secondary-600">Documents Processed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">25</div>
                  <div className="text-secondary-600">Countries Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <Target className="h-16 w-16 text-primary-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">Our Mission</h3>
              <p className="text-secondary-700">
                To empower businesses worldwide with AI-powered document intelligence that eliminates manual processing, 
                reduces errors, and unlocks valuable insights from financial data.
              </p>
            </div>
            <div className="text-center">
              <Globe className="h-16 w-16 text-primary-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">Our Vision</h3>
              <p className="text-secondary-700">
                A world where every business can harness the full potential of their financial documents through 
                intelligent automation, enabling smarter decisions and accelerated growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">{value.title}</h3>
                <p className="text-secondary-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Our platform leverages cutting-edge machine learning and natural language processing 
              to deliver unmatched accuracy in financial document analysis.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Machine Learning</h3>
              <p className="text-secondary-600">
                Advanced ML algorithms trained on millions of financial documents for precise data extraction.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Secure Processing</h3>
              <p className="text-secondary-600">
                Enterprise-grade security with end-to-end encryption and compliance certifications.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Continuous Learning</h3>
              <p className="text-secondary-600">
                Our AI models continuously improve through learning, ensuring better accuracy over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Document Processing?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of businesses using FinDocAI to streamline their financial operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors">
              Start Free Trial
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/" className="flex items-center mb-4 md:mb-0">
              <FileText className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold">FinDocAI</span>
            </Link>
            <p className="text-secondary-400">
              © 2025 FinDocAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
