// Export utilities for financial dashboard data

export interface ExportTransaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
  type: 'income' | 'expense'
}

export interface ExportFinancialData {
  summary: {
    healthScore: number
    totalIncome: number
    totalExpenses: number
    netSavings: number
    savingsRate: number
    expenseRatio: number
  }
  transactions: ExportTransaction[]
  monthlyTrends: Array<{
    month: string
    income: number
    expenses: number
    savings: number
  }>
  expenseCategories: Array<{
    name: string
    value: number
    percentage: number
  }>
  generatedAt: string
}

export function exportToCSV(transactions: ExportTransaction[]): string {
  const headers = ['Date', 'Description', 'Amount', 'Category', 'Type']
  const csvRows = [
    headers.join(','),
    ...transactions.map(transaction => [
      transaction.date,
      `"${transaction.description.replace(/"/g, '""')}"`,
      transaction.amount.toString(),
      transaction.category,
      transaction.type
    ].join(','))
  ]
  
  return csvRows.join('\n')
}

export function exportToJSON(data: ExportFinancialData): string {
  return JSON.stringify(data, null, 2)
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

export function calculateTrends(transactions: ExportTransaction[]) {
  const monthlyData = new Map()
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, {
        month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        income: 0,
        expenses: 0,
        savings: 0
      })
    }
    
    const monthData = monthlyData.get(monthKey)
    if (transaction.type === 'income') {
      monthData.income += transaction.amount
    } else {
      monthData.expenses += transaction.amount
    }
    monthData.savings = monthData.income - monthData.expenses
  })
  
  return Array.from(monthlyData.values()).sort((a, b) => 
    new Date(a.month).getTime() - new Date(b.month).getTime()
  )
}

export function generateFinancialReport(data: ExportFinancialData): string {
  const report = `
FINANCIAL DASHBOARD REPORT
Generated: ${data.generatedAt}

SUMMARY
=======
Financial Health Score: ${data.summary.healthScore}/100
Total Income: ${formatCurrency(data.summary.totalIncome)}
Total Expenses: ${formatCurrency(data.summary.totalExpenses)}
Net Savings: ${formatCurrency(data.summary.netSavings)}
Savings Rate: ${(data.summary.savingsRate * 100).toFixed(1)}%
Expense Ratio: ${(data.summary.expenseRatio * 100).toFixed(1)}%

TOP EXPENSE CATEGORIES
=====================
${data.expenseCategories.slice(0, 5).map(cat => 
  `${cat.name}: ${formatCurrency(cat.value)} (${cat.percentage.toFixed(1)}%)`
).join('\n')}

MONTHLY TRENDS (Last 6 Months)
=============================
${data.monthlyTrends.slice(-6).map(trend => 
  `${trend.month}: Income ${formatCurrency(trend.income)}, Expenses ${formatCurrency(trend.expenses)}, Savings ${formatCurrency(trend.savings)}`
).join('\n')}

RECENT TRANSACTIONS
==================
${data.transactions.slice(0, 10).map(transaction => 
  `${formatDate(transaction.date)} - ${transaction.description}: ${formatCurrency(transaction.amount)} (${transaction.category})`
).join('\n')}
`.trim()
  
  return report
}
