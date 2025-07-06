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

    const ocrData = await prisma.oCRData.findMany({
      where: {
        document: {
          userId: user.userId,
        },
      },
      include: {
        document: {
          select: {
            originalName: true,
            id: true,
          },
        },
      },
      orderBy: {
        processedAt: 'desc',
      },
    })

    const formattedOCRData = ocrData.map(ocr => ({
      id: ocr.id,
      text: ocr.text,
      confidence: ocr.confidence || 0,
      processedAt: ocr.processedAt.toISOString(),
      documentId: ocr.documentId,
      documentName: ocr.document.originalName,
    }))

    return NextResponse.json({ ocrData: formattedOCRData })
  } catch (error) {
    console.error('Error fetching OCR data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch OCR data' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ocrId, newText } = await request.json()

    if (!ocrId || typeof newText !== 'string') {
      return NextResponse.json(
        { error: 'OCR ID and new text are required' },
        { status: 400 }
      )
    }

    // Verify that the OCR data belongs to the user
    const ocrData = await prisma.oCRData.findFirst({
      where: {
        id: ocrId,
        document: {
          userId: user.userId,
        },
      },
    })

    if (!ocrData) {
      return NextResponse.json(
        { error: 'OCR data not found' },
        { status: 404 }
      )
    }

    // Update the OCR text
    const updatedOCR = await prisma.oCRData.update({
      where: { id: ocrId },
      data: { 
        text: newText,
        // Optionally mark as manually edited
        confidence: ocrData.confidence, // Keep original confidence or could set to 100 for manual edits
      },
    })

    return NextResponse.json({ 
      message: 'OCR data updated successfully',
      ocrData: updatedOCR 
    })
  } catch (error) {
    console.error('Error updating OCR data:', error)
    return NextResponse.json(
      { error: 'Failed to update OCR data' },
      { status: 500 }
    )
  }
}
