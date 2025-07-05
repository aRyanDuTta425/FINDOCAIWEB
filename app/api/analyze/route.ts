import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { analyzeDocument } from '@/lib/document-analysis'

// Add GET endpoint to retrieve analysis results
export async function GET(request: NextRequest) {
  try {
    // Get user from JWT token
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const documentId = url.searchParams.get('documentId')

    // If document ID is provided, get specific analysis
    if (documentId) {
      const analysis = await prisma.analysisResult.findFirst({
        where: {
          documentId,
          document: {
            userId: user.userId
          }
        }
      })

      if (!analysis) {
        return NextResponse.json(
          { error: 'Analysis not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ analysisResult: analysis })
    } 
    
    // Otherwise, get all analyses for this user
    const analyses = await prisma.analysisResult.findMany({
      where: {
        document: {
          userId: user.userId
        }
      },
      include: {
        document: {
          select: {
            originalName: true,
            fileUrl: true,
            fileType: true,
            uploadedAt: true
          }
        }
      },
      orderBy: {
        processedAt: 'desc'
      }
    })

    return NextResponse.json({ analysisResults: analyses })
    
  } catch (error) {
    console.error('Error fetching analysis results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis results' },
      { status: 500 }
    )
  }
}

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
      },
      include: {
        ocrData: true,
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    if (!document.ocrData) {
      return NextResponse.json(
        { error: 'OCR data not found. Please run OCR first.' },
        { status: 400 }
      )
    }

    // Check if analysis already exists
    const existingAnalysis = await prisma.analysisResult.findUnique({
      where: { documentId }
    })

    if (existingAnalysis) {
      return NextResponse.json({
        message: 'Analysis already exists',
        analysisResult: existingAnalysis,
      })
    }

    // Perform analysis using Groq API (or mock implementation)
    const analysisResult = await analyzeDocument(
      document.ocrData.text,
      document.originalName
    )

    // Save analysis result to database
    const savedAnalysis = await prisma.analysisResult.create({
      data: {
        documentId,
        documentType: analysisResult.documentType,
        invoiceNumber: analysisResult.invoiceNumber,
        amount: analysisResult.amount,
        dueDate: analysisResult.dueDate ? new Date(analysisResult.dueDate) : null,
        vendor: analysisResult.vendor,
        accountNumber: analysisResult.accountNumber,
        balance: analysisResult.balance,
        statementDate: analysisResult.statementDate ? new Date(analysisResult.statementDate) : null,
        taxYear: analysisResult.taxYear,
        taxType: analysisResult.taxType,
        extractedData: analysisResult.extractedData,
        summary: analysisResult.summary,
        confidence: analysisResult.confidence,
      }
    })

    return NextResponse.json({
      message: 'Document analysis completed',
      analysisResult: savedAnalysis,
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze document' },
      { status: 500 }
    )
  }
}
