'use client'

import { useState } from 'react'
import { 
  Download, 
  FileText, 
  Database, 
  Calendar,
  CheckCircle
} from 'lucide-react'
import { 
  exportToCSV, 
  exportToJSON, 
  downloadFile, 
  generateFinancialReport,
  ExportFinancialData 
} from '@/lib/export'

interface ExportPanelProps {
  financialData: ExportFinancialData
}

export default function ExportPanel({ financialData }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [lastExport, setLastExport] = useState<string | null>(null)

  const handleExport = async (format: 'csv' | 'json' | 'report') => {
    setIsExporting(true)
    
    try {
      const timestamp = new Date().toISOString().split('T')[0]
      
      switch (format) {
        case 'csv':
          const csvContent = exportToCSV(financialData.transactions)
          downloadFile(csvContent, `transactions-${timestamp}.csv`, 'text/csv')
          break
          
        case 'json':
          const jsonContent = exportToJSON(financialData)
          downloadFile(jsonContent, `financial-data-${timestamp}.json`, 'application/json')
          break
          
        case 'report':
          const reportContent = generateFinancialReport(financialData)
          downloadFile(reportContent, `financial-report-${timestamp}.txt`, 'text/plain')
          break
      }
      
      setLastExport(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
        {lastExport && (
          <div className="flex items-center text-sm text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Last export: {lastExport}
          </div>
        )}
      </div>
      
      <p className="text-gray-600 mb-6">
        Download your financial data in various formats for backup or external analysis.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CSV Export */}
        <button
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Database className="h-8 w-8 text-blue-600 mb-2" />
          <h4 className="font-medium text-gray-900 mb-1">CSV Export</h4>
          <p className="text-sm text-gray-600 text-center">
            Transaction data in spreadsheet format
          </p>
        </button>
        
        {/* JSON Export */}
        <button
          onClick={() => handleExport('json')}
          disabled={isExporting}
          className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="h-8 w-8 text-green-600 mb-2" />
          <h4 className="font-medium text-gray-900 mb-1">JSON Export</h4>
          <p className="text-sm text-gray-600 text-center">
            Complete data including charts and analysis
          </p>
        </button>
        
        {/* Report Export */}
        <button
          onClick={() => handleExport('report')}
          disabled={isExporting}
          className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Calendar className="h-8 w-8 text-purple-600 mb-2" />
          <h4 className="font-medium text-gray-900 mb-1">Summary Report</h4>
          <p className="text-sm text-gray-600 text-center">
            Human-readable financial summary
          </p>
        </button>
      </div>
      
      {isExporting && (
        <div className="mt-4 flex items-center justify-center">
          <Download className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-gray-600">Preparing download...</span>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Export Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Transactions:</span>
            <span className="ml-2 font-medium">{financialData.transactions.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Date Range:</span>
            <span className="ml-2 font-medium">
              {financialData.transactions.length > 0 
                ? `${financialData.transactions[financialData.transactions.length - 1]?.date || 'N/A'} - ${financialData.transactions[0]?.date || 'N/A'}`
                : 'No data'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
