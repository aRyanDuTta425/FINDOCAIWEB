import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')

    // Get user's documents with analysis results
    const whereClause = documentId 
      ? { userId: user.userId, id: documentId }
      : { userId: user.userId }

    const documents = await prisma.document.findMany({
      where: whereClause,
      include: {
        analysisResult: true,
        ocrData: true,
      },
      orderBy: { uploadedAt: 'desc' },
    })

    // Debug: Log the actual data structure
    console.log('Documents found:', documents.length)
    documents.forEach((doc, index) => {
      console.log(`Document ${index + 1}:`, {
        id: doc.id,
        filename: doc.filename,
        hasAnalysisResult: !!doc.analysisResult,
        analysisResult: doc.analysisResult ? {
          documentType: doc.analysisResult.documentType,
          amount: doc.analysisResult.amount,
          vendor: doc.analysisResult.vendor,
          balance: doc.analysisResult.balance,
          extractedData: doc.analysisResult.extractedData
        } : null
      })
    })

    // Calculate financial summary with better data extraction
    let totalIncome = 0
    let totalExpenses = 0
    const expenseCategories: { [key: string]: number } = {}
    const processedTransactions: any[] = []
    
    // Process analysis results to extract financial data
    documents.forEach(doc => {
      if (doc.analysisResult) {
        let amount = 0
        let transactionType = 'expense'
        
        // Try to extract amount from multiple sources
        if (doc.analysisResult.amount && doc.analysisResult.amount > 0) {
          amount = doc.analysisResult.amount
        } else if (doc.analysisResult.balance && doc.analysisResult.balance > 0) {
          amount = doc.analysisResult.balance
          transactionType = 'income'
        } else if (doc.analysisResult.extractedData) {
          // Try to extract from JSON data
          const extractedData = doc.analysisResult.extractedData as any
          if (extractedData.total_amount) {
            amount = parseFloat(extractedData.total_amount.toString())
          } else if (extractedData.amount) {
            amount = parseFloat(extractedData.amount.toString())
          } else if (extractedData.balance) {
            amount = parseFloat(extractedData.balance.toString())
            transactionType = 'income'
          }
        }

        if (amount > 0) {
          const documentType = doc.analysisResult.documentType || 'other'
          
          // Determine transaction type based on document type and content
          if (documentType === 'bank_statement' || transactionType === 'income') {
            totalIncome += amount
            transactionType = 'income'
          } else {
            totalExpenses += amount
            transactionType = 'expense'
            
            // Categorize expenses
            const category = categorizeExpense(doc.analysisResult.vendor || doc.filename || 'Other')
            expenseCategories[category] = (expenseCategories[category] || 0) + amount
          }

          // Add to processed transactions
          processedTransactions.push({
            id: `tx-${doc.id}`,
            documentId: doc.id,
            date: doc.uploadedAt,
            description: doc.analysisResult.vendor || `Transaction from ${doc.originalName}`,
            category: transactionType === 'income' ? 'Income' : categorizeExpense(doc.analysisResult.vendor || doc.filename || 'Other'),
            amount: amount,
            type: transactionType,
            source: 'OCR',
            filename: doc.originalName,
            documentType: documentType
          })
        }
      }
    })

    const netSavings = totalIncome - totalExpenses

    // Calculate health score
    const healthScore = calculateHealthScore(totalIncome, totalExpenses, netSavings)

    // Generate monthly trend data based on actual documents
    const monthlyTrends = generateMonthlyTrendsFromData(processedTransactions)

    // Format expense categories for chart
    const expenseCategoryData = Object.entries(expenseCategories).map(([name, value], index) => ({
      name,
      value,
      percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
      color: getColorForCategory(index),
    }))

    const financialData = {
      summary: {
        healthScore,
        totalIncome,
        totalExpenses,
        netSavings,
        monthlyChange: calculateMonthlyChange(processedTransactions),
        documentsCount: documents.length,
        documentsWithData: documents.filter(d => d.analysisResult).length
      },
      expenseCategories: expenseCategoryData,
      monthlyTrends,
      transactions: processedTransactions,
      recommendations: generateRecommendations(healthScore, totalIncome, totalExpenses),
      documents: documents.map(doc => ({
        id: doc.id,
        filename: doc.originalName,
        uploadedAt: doc.uploadedAt,
        hasAnalysisResult: !!doc.analysisResult,
        documentType: doc.analysisResult?.documentType,
        amount: doc.analysisResult?.amount || doc.analysisResult?.balance || 0
      })),
      debug: {
        totalDocuments: documents.length,
        documentsWithAnalysis: documents.filter(d => d.analysisResult).length,
        documentsWithAmount: documents.filter(d => d.analysisResult && (d.analysisResult.amount || d.analysisResult.balance)).length
      }
    }

    return NextResponse.json(financialData)
  } catch (error) {
    console.error('Error fetching financial dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch financial data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function categorizeExpense(vendor: string): string {
  const vendorLower = vendor.toLowerCase()
  
  if (vendorLower.includes('restaurant') || vendorLower.includes('food') || vendorLower.includes('cafe') || vendorLower.includes('dining')) {
    return 'Food & Dining'
  } else if (vendorLower.includes('gas') || vendorLower.includes('uber') || vendorLower.includes('transport') || vendorLower.includes('taxi')) {
    return 'Transportation'
  } else if (vendorLower.includes('amazon') || vendorLower.includes('store') || vendorLower.includes('shop') || vendorLower.includes('retail')) {
    return 'Shopping'
  } else if (vendorLower.includes('electric') || vendorLower.includes('water') || vendorLower.includes('utility') || vendorLower.includes('bill')) {
    return 'Bills & Utilities'
  } else if (vendorLower.includes('medical') || vendorLower.includes('health') || vendorLower.includes('pharmacy') || vendorLower.includes('doctor')) {
    return 'Healthcare'
  } else if (vendorLower.includes('entertainment') || vendorLower.includes('movie') || vendorLower.includes('game') || vendorLower.includes('music')) {
    return 'Entertainment'
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

function generateMonthlyTrendsFromData(transactions: any[]) {
  const monthlyData: { [key: string]: { income: number, expenses: number } } = {}
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date)
    const monthKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 }
    }
    
    if (transaction.type === 'income') {
      monthlyData[monthKey].income += transaction.amount
    } else {
      monthlyData[monthKey].expenses += transaction.amount
    }
  })
  
  // Convert to array and calculate savings
  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      savings: data.income - data.expenses,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
}

function calculateMonthlyChange(transactions: any[]) {
  // Simple calculation for demo - in real app would compare with previous period
  const currentMonth = new Date().getMonth()
  const lastMonth = currentMonth - 1
  
  const currentMonthTransactions = transactions.filter(t => new Date(t.date).getMonth() === currentMonth)
  const lastMonthTransactions = transactions.filter(t => new Date(t.date).getMonth() === lastMonth)
  
  const currentIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const lastIncome = lastMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  
  const currentExpenses = currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const lastExpenses = lastMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  
  return {
    income: lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0,
    expenses: lastExpenses > 0 ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0,
    savings: (currentIncome - currentExpenses) - (lastIncome - lastExpenses)
  }
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
