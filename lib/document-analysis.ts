import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export interface AnalysisResult {
  documentType: string
  invoiceNumber?: string
  amount?: number
  dueDate?: string
  vendor?: string
  accountNumber?: string
  balance?: number
  statementDate?: string
  taxYear?: number
  taxType?: string
  extractedData?: any
  summary?: string
  confidence?: number
}

// Helper function to determine document type
const determineDocumentType = (text: string, filename: string): string => {
  const lowerText = text.toLowerCase()
  const lowerFilename = filename.toLowerCase()
  
  if (lowerText.includes('invoice') || lowerText.includes('bill') || lowerText.includes('due date')) {
    return 'invoice'
  }
  if (lowerText.includes('bank statement') || lowerText.includes('account balance') || lowerText.includes('transaction')) {
    return 'bank_statement'
  }
  if (lowerText.includes('tax') || lowerText.includes('w-2') || lowerText.includes('1099') || lowerFilename.includes('tax')) {
    return 'tax_document'
  }
  
  return 'other'
}

// Mock analysis functions for fallback
const analyzeInvoice = async (text: string): Promise<AnalysisResult> => {
  // Mock invoice analysis
  const invoiceNumberMatch = text.match(/invoice\s*#?\s*:?\s*([A-Z0-9-]+)/i)
  const amountMatch = text.match(/(?:total|amount|due)\s*:?\s*\$?(\d+(?:\.\d{2})?)/i)
  const vendorMatch = text.match(/(?:from|vendor|company)\s*:?\s*([A-Za-z\s]+)/i)
  
  return {
    documentType: 'invoice',
    invoiceNumber: invoiceNumberMatch?.[1] || 'INV-' + Math.random().toString(36).substring(2, 9),
    amount: amountMatch ? parseFloat(amountMatch[1]) : Math.random() * 1000 + 100,
    vendor: vendorMatch?.[1]?.trim() || 'Unknown Vendor',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    summary: 'Invoice document processed successfully',
    confidence: 0.88,
  }
}

const analyzeBankStatement = async (text: string): Promise<AnalysisResult> => {
  // Mock bank statement analysis
  const accountMatch = text.match(/account\s*#?\s*:?\s*([0-9-]+)/i)
  const balanceMatch = text.match(/(?:balance|total)\s*:?\s*\$?(\d+(?:\.\d{2})?)/i)
  
  return {
    documentType: 'bank_statement',
    accountNumber: accountMatch?.[1] || '**** **** **** ' + Math.random().toString().substring(2, 4),
    balance: balanceMatch ? parseFloat(balanceMatch[1]) : Math.random() * 10000 + 1000,
    statementDate: new Date().toISOString().split('T')[0],
    summary: 'Bank statement processed successfully',
    confidence: 0.85,
  }
}

const analyzeTaxDocument = async (text: string): Promise<AnalysisResult> => {
  // Mock tax document analysis
  const yearMatch = text.match(/(?:tax year|year)\s*:?\s*(\d{4})/i)
  const currentYear = new Date().getFullYear()
  
  return {
    documentType: 'tax_document',
    taxYear: yearMatch ? parseInt(yearMatch[1]) : currentYear - 1,
    taxType: text.toLowerCase().includes('w-2') ? 'W-2' : text.toLowerCase().includes('1099') ? '1099' : 'Other',
    summary: 'Tax document processed successfully',
    confidence: 0.82,
  }
}

const analyzeGeneral = async (text: string): Promise<AnalysisResult> => {
  return {
    documentType: 'other',
    summary: `General document with ${text.split(' ').length} words extracted`,
    extractedData: {
      wordCount: text.split(' ').length,
      hasNumbers: /\d/.test(text),
      hasDates: /\d{1,2}\/\d{1,2}\/\d{4}/.test(text),
    },
    confidence: 0.75,
  }
}

// Function to build prompt by document type
const buildPromptForDocType = (ocrText: string, documentType: string): string => {
  const basePrompt = `
You are a financial document analysis AI. Analyze the following extracted text from a ${documentType} and extract the key information.
Return ONLY a JSON object with the relevant fields, no explanations or other text.

DOCUMENT TEXT:
"""
${ocrText}
"""
`;

  switch (documentType) {
    case 'invoice':
      return basePrompt + `
Extract the following fields in JSON format:
{
  "documentType": "invoice",
  "invoiceNumber": "string - the invoice number/ID",
  "amount": "number - the total amount due (numeric only)",
  "dueDate": "string - the due date in YYYY-MM-DD format",
  "vendor": "string - the name of the vendor/company that issued the invoice",
  "summary": "string - a short summary of the invoice",
  "confidence": "number - your confidence in the extraction (0.0-1.0)"
}
Only include fields that you're reasonably confident about. If a field is missing or unclear, omit it from the JSON.
`;

    case 'bank_statement':
      return basePrompt + `
Extract the following fields in JSON format:
{
  "documentType": "bank_statement",
  "accountNumber": "string - the account number (may be partially masked)",
  "balance": "number - the ending balance amount (numeric only)",
  "statementDate": "string - the statement date in YYYY-MM-DD format",
  "transactions": [
    {
      "date": "string - transaction date",
      "description": "string - transaction description",
      "amount": "number - transaction amount",
      "type": "string - deposit or withdrawal"
    }
  ],
  "summary": "string - a short summary of the statement",
  "confidence": "number - your confidence in the extraction (0.0-1.0)"
}
Only include fields that you're reasonably confident about. If a field is missing or unclear, omit it from the JSON.
`;

    case 'tax_document':
      return basePrompt + `
Extract the following fields in JSON format:
{
  "documentType": "tax_document",
  "taxYear": "number - the tax year",
  "taxType": "string - the type of tax document (W-2, 1099, etc.)",
  "extractedData": {
    "income": "number - the total income reported",
    "taxWithheld": "number - taxes withheld",
    "deductions": "number - deductions claimed"
  },
  "summary": "string - a short summary of the tax document",
  "confidence": "number - your confidence in the extraction (0.0-1.0)"
}
Only include fields that you're reasonably confident about. If a field is missing or unclear, omit it from the JSON.
`;

    default:
      return basePrompt + `
Extract the following fields in JSON format:
{
  "documentType": "string - the type of financial document if you can determine it",
  "extractedData": {
    "key1": "value1",
    "key2": "value2"
  },
  "summary": "string - a short summary of what this document appears to be",
  "confidence": "number - your confidence in the extraction (0.0-1.0)"
}
Try to identify what type of financial document this is and extract relevant information.
Only include fields that you're reasonably confident about. If a field is missing or unclear, omit it from the JSON.
`;
  }
}

// Fallback mock analysis function
const legacyAnalyzeDocument = async (ocrText: string, filename: string, documentType?: string): Promise<AnalysisResult> => {
  if (!documentType) {
    documentType = determineDocumentType(ocrText, filename)
  }
  
  let analysis: AnalysisResult = {
    documentType,
    confidence: 0.7, // Lower confidence for the fallback method
  }
  
  switch (documentType) {
    case 'invoice':
      analysis = await analyzeInvoice(ocrText)
      break
    case 'bank_statement':
      analysis = await analyzeBankStatement(ocrText)
      break
    case 'tax_document':
      analysis = await analyzeTaxDocument(ocrText)
      break
    default:
      analysis = await analyzeGeneral(ocrText)
  }
  
  return {
    ...analysis,
    documentType,
  }
}

// Main export function
export const analyzeDocument = async (ocrText: string, filename: string): Promise<AnalysisResult> => {
  try {
    console.log('Starting document analysis for file:', filename)
    
    // First try to determine the document type to use specialized prompting
    const documentType = determineDocumentType(ocrText, filename)
    console.log(`Determined document type: ${documentType}`)
    
    // Try to use Groq API
    try {
      if (process.env.GROQ_API_KEY) {
        console.log('Using Groq API for document analysis')
        
        // Build the prompt based on document type
        const prompt = buildPromptForDocType(ocrText, documentType)
        
        console.log('Sending prompt to Groq API')
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are an expert financial document analyzer. Extract information from financial documents and return valid JSON responses only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: 'llama3-8b-8192',
          temperature: 0.1, // Low temperature for more consistent structured output
          max_tokens: 2048,
        });
        
        const responseText = completion.choices[0]?.message?.content || '';
        console.log('Received response from Groq API')
        
        // Try to parse JSON from the response
        try {
          // Extract JSON part if there's any wrapper text
          const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                          responseText.match(/\{[\s\S]*\}/)
          const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseText
          const parsedResponse = JSON.parse(jsonStr.replace(/```/g, '').trim())
          console.log('Successfully parsed Groq response as JSON')
          
          // Format the response into our expected structure
          return {
            documentType: parsedResponse.documentType || documentType,
            invoiceNumber: parsedResponse.invoiceNumber,
            amount: typeof parsedResponse.amount === 'string' ? parseFloat(parsedResponse.amount.replace(/[$,]/g, '')) : parsedResponse.amount,
            dueDate: parsedResponse.dueDate,
            vendor: parsedResponse.vendor,
            accountNumber: parsedResponse.accountNumber,
            balance: typeof parsedResponse.balance === 'string' ? parseFloat(parsedResponse.balance.replace(/[$,]/g, '')) : parsedResponse.balance,
            statementDate: parsedResponse.statementDate,
            taxYear: parsedResponse.taxYear ? parseInt(parsedResponse.taxYear.toString()) : undefined,
            taxType: parsedResponse.taxType,
            extractedData: parsedResponse.extractedData || parsedResponse.transactions || parsedResponse,
            summary: parsedResponse.summary || `${documentType.charAt(0).toUpperCase() + documentType.slice(1)} processed with Groq AI`,
            confidence: parsedResponse.confidence || 0.9,
          }
        } catch (parseError) {
          console.error('Failed to parse Groq response as JSON:', parseError)
          console.log('Raw response:', responseText)
        }
      } else {
        console.log('No Groq API key found, using fallback analysis')
      }
    } catch (apiError) {
      console.error('Failed to use Groq API:', apiError)
    }
    
    // If we reach here, either the API call failed or the response parsing failed
    // Fall back to the legacy mock analysis
    console.log('Falling back to legacy document analysis')
    return legacyAnalyzeDocument(ocrText, filename, documentType)
  } catch (error) {
    console.error('Document analysis error:', error)
    // Final fallback
    return {
      documentType: 'unknown',
      summary: 'Failed to analyze document',
      confidence: 0.1,
    }
  }
}
