import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, we'll return sample transactions based on analysis results
    // In a full implementation, you'd have a separate transactions table
    const documents = await prisma.document.findMany({
      where: { userId: user.userId },
      include: {
        analysisResult: true,
      },
      orderBy: { uploadedAt: 'desc' },
    })

    const transactions = documents
      .filter(doc => doc.analysisResult?.amount)
      .map((doc, index) => ({
        id: `tx-${doc.id}`,
        date: doc.uploadedAt.toISOString(),
        description: doc.analysisResult?.vendor || `Transaction from ${doc.originalName}`,
        category: categorizeExpense(doc.analysisResult?.vendor || 'Other'),
        amount: doc.analysisResult?.amount || 0,
        type: doc.analysisResult?.documentType === 'bank_statement' ? 'income' : 'expense',
        source: 'OCR',
        documentId: doc.id,
      }))

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { date, description, category, amount, type } = await request.json()

    if (!date || !description || !category || !amount || !type) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // For now, we'll create a document entry for manual transactions
    // In a full implementation, you'd have a separate transactions table
    const document = await prisma.document.create({
      data: {
        filename: `manual-${Date.now()}.json`,
        originalName: `Manual Transaction: ${description}`,
        fileUrl: '',
        fileType: 'manual',
        fileSize: 0,
        userId: user.userId,
        analysisResult: {
          create: {
            documentType: type === 'income' ? 'bank_statement' : 'invoice',
            vendor: description,
            amount: parseFloat(amount),
            summary: `Manual ${type} entry`,
            confidence: 1.0,
          },
        },
      },
      include: {
        analysisResult: true,
      },
    })

    const transaction = {
      id: `tx-${document.id}`,
      date: document.uploadedAt.toISOString(),
      description,
      category,
      amount: parseFloat(amount),
      type,
      source: 'manual',
      documentId: document.id,
    }

    return NextResponse.json({ 
      message: 'Transaction created successfully',
      transaction 
    })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
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

    const { transactionId, date, description, category, amount, type } = await request.json()

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    // Extract document ID from transaction ID
    const documentId = transactionId.replace('tx-', '')

    // Update the document and analysis result
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: user.userId,
      },
      include: {
        analysisResult: true,
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Update analysis result
    if (document.analysisResult) {
      await prisma.analysisResult.update({
        where: { id: document.analysisResult.id },
        data: {
          vendor: description,
          amount: parseFloat(amount),
          documentType: type === 'income' ? 'bank_statement' : 'invoice',
        },
      })
    }

    const updatedTransaction = {
      id: transactionId,
      date: date || document.uploadedAt.toISOString(),
      description,
      category,
      amount: parseFloat(amount),
      type,
      source: document.fileType === 'manual' ? 'manual' : 'OCR',
      documentId: document.id,
    }

    return NextResponse.json({ 
      message: 'Transaction updated successfully',
      transaction: updatedTransaction 
    })
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('id')

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    // Extract document ID from transaction ID
    const documentId = transactionId.replace('tx-', '')

    // Verify ownership and delete
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: user.userId,
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Only allow deletion of manual transactions
    if (document.fileType === 'manual') {
      await prisma.document.delete({
        where: { id: documentId },
      })
    } else {
      return NextResponse.json(
        { error: 'Cannot delete OCR-generated transactions' },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
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
  } else if (vendorLower.includes('entertainment') || vendorLower.includes('movie') || vendorLower.includes('game')) {
    return 'Entertainment'
  } else {
    return 'Other'
  }
}
