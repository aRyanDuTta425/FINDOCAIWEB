'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Mail, Phone, MapPin, Clock, Send, MessageSquare, Users, CreditCard } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We\'ll get back to you within 24 hours.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-primary-600" />,
      title: 'Email Support',
      description: 'Get help from our support team',
      contact: 'support@findocai.com',
      availability: 'Response within 2-4 hours'
    },
    {
      icon: <Phone className="h-6 w-6 text-primary-600" />,
      title: 'Phone Support',
      description: 'Speak with our experts directly',
      contact: '+1 (555) 123-4567',
      availability: 'Mon-Fri, 9AM-6PM EST'
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary-600" />,
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      contact: 'Available in dashboard',
      availability: '24/7 for paid customers'
    },
    {
      icon: <Users className="h-6 w-6 text-primary-600" />,
      title: 'Enterprise Sales',
      description: 'Custom solutions for large teams',
      contact: 'sales@findocai.com',
      availability: 'Response within 1 hour'
    }
  ]

  const offices = [
    {
      city: 'San Francisco',
      address: '123 Market Street, Suite 456\nSan Francisco, CA 94105',
      isHeadquarters: true
    },
    {
      city: 'New York',
      address: '789 Broadway, Floor 12\nNew York, NY 10003',
      isHeadquarters: false
    },
    {
      city: 'London',
      address: '456 Oxford Street\nLondon, W1C 1AP, UK',
      isHeadquarters: false
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
              Get in Touch
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Have questions about FinDocAI? We're here to help! Reach out to our team and we'll get back to you quickly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  {method.icon}
                </div>
                <h3 className="text-lg font-bold text-secondary-900 mb-2">{method.title}</h3>
                <p className="text-secondary-600 text-sm mb-3">{method.description}</p>
                <p className="text-primary-600 font-medium mb-1">{method.contact}</p>
                <p className="text-secondary-500 text-xs">{method.availability}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6 text-center">
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-secondary-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-medium text-secondary-700 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="general">General Question</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="enterprise">Enterprise Solutions</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Our Offices
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  {office.city}
                  {office.isHeadquarters && (
                    <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                      HQ
                    </span>
                  )}
                </h3>
                <p className="text-secondary-600 whitespace-pre-line">{office.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Common Questions
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                How quickly do you respond to inquiries?
              </h3>
              <p className="text-secondary-600">
                We aim to respond to all inquiries within 2-4 hours during business hours. 
                Enterprise customers receive priority support with 1-hour response times.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Do you offer phone consultations?
              </h3>
              <p className="text-secondary-600">
                Yes! We're happy to schedule a phone or video consultation to discuss your specific needs. 
                Just mention this in your message and we'll coordinate a time.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Can you help with implementation?
              </h3>
              <p className="text-secondary-600">
                Absolutely. Our team provides full implementation support, including API integration assistance, 
                custom workflow setup, and training for your team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Don't wait! Start your free trial today and see how FinDocAI can transform your document processing.
          </p>
          <Link href="/signup" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors">
            Start Free Trial
          </Link>
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
