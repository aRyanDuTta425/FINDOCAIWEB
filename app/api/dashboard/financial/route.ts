import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's documents with analysis results
    const documents = await prisma.document.findMany({
      where: { userId: user.userId },
      include: {
        analysisResult: true,
        ocrData: true,
      },
      orderBy: { uploadedAt: 'desc' },
    })

    // Calculate financial summary with improved data extraction
    let totalIncome = 0
    let totalExpenses = 0
    const expenseCategories: { [key: string]: number } = {}
    
    // Debug: Log documents found and their analysis results
    console.log(`Processing ${documents.length} documents for financial analysis`)
    
    // Process analysis results to extract financial data
    documents.forEach(doc => {
      console.log(`Processing document: ${doc.originalName}`, {
        hasAnalysisResult: !!doc.analysisResult,
        analysisResult: doc.analysisResult ? {
          amount: doc.analysisResult.amount,
          balance: doc.analysisResult.balance,
          documentType: doc.analysisResult.documentType,
          vendor: doc.analysisResult.vendor
        } : null
      })
      
      if (doc.analysisResult) {
        let amount = 0
        
        // Try to extract amount from multiple sources
        if (doc.analysisResult.amount && doc.analysisResult.amount > 0) {
          amount = doc.analysisResult.amount
        } else if (doc.analysisResult.balance && doc.analysisResult.balance > 0) {
          amount = doc.analysisResult.balance
        } else if (doc.analysisResult.extractedData) {
          // Try to extract from JSON data
          const extractedData = doc.analysisResult.extractedData as any
          if (extractedData.total_amount) {
            amount = parseFloat(extractedData.total_amount.toString())
          } else if (extractedData.amount) {
            amount = parseFloat(extractedData.amount.toString())
          } else if (extractedData.balance) {
            amount = parseFloat(extractedData.balance.toString())
          }
        }

        console.log(`Extracted amount: ${amount} from document: ${doc.originalName}`)

        if (amount > 0) {
          const { documentType } = doc.analysisResult
          
          if (documentType === 'bank_statement') {
            // For bank statements, consider positive amounts as income
            totalIncome += amount
          } else if (documentType === 'invoice' || !documentType || documentType === 'other') {
            // For invoices and unknown types, consider as expenses
            totalExpenses += amount
            
            // Categorize expenses (simplified categorization)
            const category = categorizeExpense(doc.analysisResult.vendor || doc.filename || 'Other')
            expenseCategories[category] = (expenseCategories[category] || 0) + amount
          }
        }
      }
    })
    
    console.log(`Financial calculation results:`, {
      totalIncome,
      totalExpenses,
      expenseCategories,
      documentsProcessed: documents.length,
      documentsWithAnalysis: documents.filter(d => d.analysisResult).length
    })

    const netSavings = totalIncome - totalExpenses

    // Calculate health score (simplified algorithm)
    const healthScore = calculateHealthScore(totalIncome, totalExpenses, netSavings)

    // Generate monthly trend data (sample data for demo)
    const monthlyTrends = generateMonthlyTrends()

    // Format expense categories for chart
    const expenseCategoryData = Object.entries(expenseCategories).map(([name, value], index) => ({
      name,
      value,
      percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
      color: getColorForCategory(index),
    }))

    // Sample transaction data (in real app, this would come from transaction parsing)
    const transactions = generateSampleTransactions(documents)

    const financialData = {
      summary: {
        healthScore,
        totalIncome,
        totalExpenses,
        netSavings,
        monthlyChange: {
          income: 12.5, // Sample percentage changes
          expenses: -5.2,
          savings: 28.3,
        },
      },
      expenseCategories: expenseCategoryData,
      monthlyTrends,
      transactions,
      recommendations: generateRecommendations(healthScore, totalIncome, totalExpenses),
    }

    return NextResponse.json(financialData)
  } catch (error) {
    console.error('Error fetching financial dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch financial data' },
      { status: 500 }
    )
  }
}

function categorizeExpense(vendor: string): string {
  const vendorLower = vendor.toLowerCase()
  
  if (vendorLower.includes('restaurant') || vendorLower.includes('food') || vendorLower.includes('cafe')) {
    return 'Food & Dining'
  } else if (vendorLower.includes('gas') || vendorLower.includes('uber') || vendorLower.includes('transport')) {
    return 'Transportation'
  } else if (vendorLower.includes('amazon') || vendorLower.includes('store') || vendorLower.includes('shop')) {
    return 'Shopping'
  } else if (vendorLower.includes('electric') || vendorLower.includes('water') || vendorLower.includes('utility')) {
    return 'Bills & Utilities'
  } else if (vendorLower.includes('medical') || vendorLower.includes('health') || vendorLower.includes('pharmacy')) {
    return 'Healthcare'
  } else {
    return 'Other'
  }
}

function calculateHealthScore(income: number, expenses: number, savings: number): number {
  if (income === 0) return 0
  
  const savingsRate = savings / income
  const expenseRatio = expenses / income
  
  let score = 50 // Base score
  
  // Savings rate impact (40 points)
  if (savingsRate >= 0.2) score += 40
  else if (savingsRate >= 0.1) score += 30
  else if (savingsRate >= 0.05) score += 20
  else if (savingsRate >= 0) score += 10
  else score -= 20
  
  // Expense ratio impact (30 points)
  if (expenseRatio <= 0.5) score += 30
  else if (expenseRatio <= 0.7) score += 20
  else if (expenseRatio <= 0.9) score += 10
  else score -= 10
  
  // Income stability (20 points) - simplified
  score += 20
  
  return Math.max(0, Math.min(100, Math.round(score)))
}

function generateMonthlyTrends() {
  const months = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024']
  return months.map(month => ({
    month,
    income: Math.floor(Math.random() * 2000) + 4000,
    expenses: Math.floor(Math.random() * 1500) + 2500,
    savings: 0, // Will be calculated by the chart component
  })).map(data => ({
    ...data,
    savings: data.income - data.expenses,
  }))
}

function generateSampleTransactions(documents: any[]) {
  const transactions: any[] = []
  const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Healthcare', 'Entertainment']
  
  // Generate some sample transactions based on documents
  documents.slice(0, 10).forEach((doc, index) => {
    if (doc.analysisResult?.amount) {
      transactions.push({
        id: `tx-${doc.id}`,
        date: doc.uploadedAt,
        description: doc.analysisResult.vendor || `Transaction from ${doc.originalName}`,
        category: categories[index % categories.length],
        amount: doc.analysisResult.amount,
        type: doc.analysisResult.documentType === 'bank_statement' ? 'income' : 'expense',
        source: 'OCR',
      })
    }
  })
  
  return transactions
}

function generateRecommendations(healthScore: number, income: number, expenses: number) {
  const recommendations = []
  
  if (healthScore < 60) {
    recommendations.push({
      id: 'health-low',
      type: 'warning',
      title: 'Improve Your Financial Health',
      description: 'Your financial health score is below average. Consider reducing expenses and increasing savings.',
      action: 'View expense breakdown',
      priority: 'high',
    })
  }
  
  if (expenses > income * 0.8) {
    recommendations.push({
      id: 'expenses-high',
      type: 'warning',
      title: 'High Expense Ratio',
      description: 'Your expenses are more than 80% of your income. Try to reduce unnecessary spending.',
      action: 'Review expenses',
      priority: 'high',
    })
  }
  
  if (income > 0 && (income - expenses) / income < 0.1) {
    recommendations.push({
      id: 'savings-low',
      type: 'tip',
      title: 'Increase Your Savings Rate',
      description: 'Try to save at least 10% of your income for a healthy financial future.',
      action: 'Set savings goal',
      priority: 'medium',
    })
  }
  
  return recommendations
}

function getColorForCategory(index: number): string {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
  ]
  return colors[index % colors.length]
}
