import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Return sample data for testing the dashboard without authentication
    const sampleData = {
      totalIncome: 8950,
      totalExpenses: 2840,
      netSavings: 6110,
      monthlyTrend: [
        { month: 'Jan', income: 8500, expenses: 2200 },
        { month: 'Feb', income: 9200, expenses: 2650 },
        { month: 'Mar', income: 8950, expenses: 2840 },
      ],
      expensesByCategory: [
        { category: 'Food & Dining', amount: 890, percentage: 31.3 },
        { category: 'Transportation', amount: 560, percentage: 19.7 },
        { category: 'Utilities', amount: 420, percentage: 14.8 },
        { category: 'Entertainment', amount: 340, percentage: 12.0 },
        { category: 'Healthcare', amount: 280, percentage: 9.9 },
        { category: 'Shopping', amount: 350, percentage: 12.3 },
      ],
      incomeBySource: [
        { source: 'Salary', amount: 7500, percentage: 83.8 },
        { source: 'Freelance', amount: 950, percentage: 10.6 },
        { source: 'Investment', amount: 500, percentage: 5.6 },
      ],
      documentSummary: {
        totalDocuments: 8,
        recentUploads: 3,
        pendingReview: 1,
        categories: {
          receipts: 4,
          bank_statements: 2,
          invoices: 2,
        }
      },
      recentTransactions: [
        {
          id: '1',
          description: 'Salary Deposit',
          amount: 3500,
          type: 'income',
          date: '2025-01-15',
          vendor: 'ABC Company Payroll'
        },
        {
          id: '2',
          description: 'Grocery Shopping',
          amount: -127.50,
          type: 'expense',
          date: '2025-01-14',
          vendor: 'Whole Foods Market'
        },
        {
          id: '3',
          description: 'Restaurant Dinner',
          amount: -67.25,
          type: 'expense',
          date: '2025-01-13',
          vendor: 'Olive Garden'
        },
        {
          id: '4',
          description: 'Gas Station',
          amount: -45.80,
          type: 'expense',
          date: '2025-01-12',
          vendor: 'Shell Gas Station'
        }
      ]
    }

    return NextResponse.json(sampleData)
  } catch (error) {
    console.error('Error in financial test API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
