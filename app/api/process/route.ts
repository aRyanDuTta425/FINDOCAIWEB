import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { performOCR, performOCROnPDF } from '@/lib/ocr'
import { analyzeDocument } from '@/lib/gemini'

/**
 * Batch processes a document for both OCR and analysis in one request
 */
export async function POST(request: NextRequest) {
  try {
    // Get user from JWT token
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { documentId } = await request.json()

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    // Find the document and verify ownership
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: user.userId,
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Step 1: Check if OCR already exists, if not perform OCR
    let ocrData = await prisma.oCRData.findUnique({
      where: { documentId }
    })

    if (!ocrData) {
      // Perform OCR based on file type
      let ocrResult;
      
      if (document.fileType === 'application/pdf') {
        // For PDF files, fetch and process
        const response = await fetch(document.fileUrl)
        const pdfBuffer = Buffer.from(await response.arrayBuffer())
        ocrResult = await performOCROnPDF(pdfBuffer)
      } else {
        // For image files
        ocrResult = await performOCR(document.fileUrl)
      }

      // Save OCR data to database
      let combinedText = '';
      let averageConfidence = 0;

      if (Array.isArray(ocrResult)) {
        // Handle PDF with multiple pages
        combinedText = ocrResult.map((result, index) => 
          `--- Page ${index + 1} ---\n${result.text}`
        ).join('\n\n');
        averageConfidence = ocrResult.reduce((sum, result) => sum + result.confidence, 0) / ocrResult.length;
      } else {
        // Handle single image
        combinedText = ocrResult.text;
        averageConfidence = ocrResult.confidence;
      }

      ocrData = await prisma.oCRData.create({
        data: {
          documentId,
          text: combinedText,
          confidence: averageConfidence,
        }
      })
    }

    // Step 2: Check if analysis already exists, if not perform analysis
    let analysisResult = await prisma.analysisResult.findUnique({
      where: { documentId }
    })

    if (!analysisResult) {
      // Perform analysis using Gemini API
      const analysis = await analyzeDocument(
        ocrData.text,
        document.originalName
      )

      // Save analysis result to database
      analysisResult = await prisma.analysisResult.create({
        data: {
          documentId,
          documentType: analysis.documentType,
          invoiceNumber: analysis.invoiceNumber,
          amount: analysis.amount,
          dueDate: analysis.dueDate ? new Date(analysis.dueDate) : null,
          vendor: analysis.vendor,
          accountNumber: analysis.accountNumber,
          balance: analysis.balance,
          statementDate: analysis.statementDate ? new Date(analysis.statementDate) : null,
          taxYear: analysis.taxYear,
          taxType: analysis.taxType,
          extractedData: analysis.extractedData,
          summary: analysis.summary,
          confidence: analysis.confidence,
        }
      })
    }

    // Return the combined results
    return NextResponse.json({
      message: 'Document processed successfully',
      ocrData,
      analysisResult,
      document: {
        id: document.id,
        filename: document.filename,
        originalName: document.originalName,
        fileUrl: document.fileUrl,
        fileType: document.fileType,
      }
    })

  } catch (error) {
    console.error('Document processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    )
  }
}
