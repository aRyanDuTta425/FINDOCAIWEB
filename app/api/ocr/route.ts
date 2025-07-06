import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { performOCR, performOCROnPDF } from '@/lib/ocr'
import { ragService } from '@/lib/rag-service'

export const dynamic = 'force-dynamic'

// Add GET endpoint to retrieve OCR data
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

    // If document ID is provided, get specific OCR data
    if (documentId) {
      const ocrData = await prisma.oCRData.findFirst({
        where: {
          documentId,
          document: {
            userId: user.userId
          }
        }
      })

      if (!ocrData) {
        return NextResponse.json(
          { error: 'OCR data not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ ocrData })
    } 
    
    // Otherwise, get all OCR data for this user
    const ocrDataList = await prisma.oCRData.findMany({
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

    return NextResponse.json({ ocrDataList })
    
  } catch (error) {
    console.error('Error fetching OCR data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch OCR data' },
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
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Check if OCR already exists
    const existingOCR = await prisma.oCRData.findUnique({
      where: { documentId }
    })

    if (existingOCR) {
      return NextResponse.json({
        message: 'OCR data already exists',
        ocrData: existingOCR,
      })
    }

    let ocrResult
    
    // Perform OCR based on file type
    if (document.fileType === 'application/pdf') {
      // For PDF files, we need to fetch the file and process it
      const response = await fetch(document.fileUrl)
      const pdfBuffer = Buffer.from(await response.arrayBuffer())
      ocrResult = await performOCROnPDF(pdfBuffer)
    } else {
      // For image files, use the URL directly
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

    const ocrData = await prisma.oCRData.create({
      data: {
        documentId,
        text: combinedText,
        confidence: averageConfidence,
      }
    })

    // Trigger embedding regeneration in the background after OCR completion
    ragService.embedDocument(documentId).catch(error => {
      console.error('Failed to regenerate embeddings after OCR for document:', documentId, error)
    })

    return NextResponse.json({
      message: 'OCR processing completed',
      ocrData,
    })

  } catch (error) {
    console.error('OCR processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process OCR' },
      { status: 500 }
    )
  }
}
