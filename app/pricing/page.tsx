'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Check, Star, CreditCard, Users, Building2, Phone, Mail } from 'lucide-react'

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses and freelancers',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        'Up to 100 documents/month',
        'Basic OCR & data extraction',
        'Email support',
        'Standard security',
        'API access',
        '5 team members'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses',
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        'Up to 1,000 documents/month',
        'Advanced AI extraction',
        'Priority support',
        'Enterprise security',
        'Advanced API',
        'Unlimited team members',
        'Custom workflows',
        'Analytics dashboard'
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      monthlyPrice: 299,
      annualPrice: 2990,
      features: [
        'Unlimited documents',
        'Custom AI models',
        '24/7 dedicated support',
        'Advanced security & compliance',
        'White-label solutions',
        'Custom integrations',
        'On-premise deployment',
        'SLA guarantees'
      ],
      popular: false,
      cta: 'Contact Sales'
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your business. Start with our free trial and scale as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-secondary-900' : 'text-secondary-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`mx-3 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-primary-600' : 'bg-secondary-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-secondary-900' : 'text-secondary-500'}`}>
              Annual
            </span>
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Save 20%
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                  plan.popular
                    ? 'border-primary-500 transform scale-105'
                    : 'border-secondary-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-secondary-900 mb-2">{plan.name}</h3>
                  <p className="text-secondary-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-secondary-900">
                      ${isAnnual ? Math.floor(plan.annualPrice / 12) : plan.monthlyPrice}
                    </span>
                    <span className="text-secondary-600">/month</span>
                  </div>

                  {isAnnual && (
                    <p className="text-sm text-green-600 font-medium">
                      Billed annually (${plan.annualPrice}/year)
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-secondary-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.cta === 'Contact Sales' ? '/contact' : '/signup'}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-center block transition-colors ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-secondary-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                What happens during the free trial?
              </h3>
              <p className="text-secondary-600">
                You get full access to all Professional plan features for 14 days. No credit card required to start.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-secondary-600">
                Yes, we offer a 30-day money-back guarantee for all paid plans. Contact our support team for assistance.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Is there a setup fee?
              </h3>
              <p className="text-secondary-600">
                No setup fees for any plan. Enterprise customers may have custom implementation costs based on requirements.
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
            Join thousands of businesses using FinDocAI to streamline their document processing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors">
              Start Free Trial
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Contact Sales
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
