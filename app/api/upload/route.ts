import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { ragService } from '@/lib/rag-service'

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

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images and PDFs are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      buffer,
      file.name,
      'findocai/documents'
    )

    // Save document metadata to database
    const document = await prisma.document.create({
      data: {
        filename: uploadResult.public_id,
        originalName: file.name,
        fileUrl: uploadResult.secure_url,
        fileType: file.type,
        fileSize: file.size,
        userId: user.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      }
    })

    // Trigger embedding creation in the background
    // We don't await this to avoid slowing down the upload response
    ragService.embedDocument(document.id).catch(error => {
      console.error('Failed to generate embeddings for document:', document.id, error)
    })

    return NextResponse.json({
      message: 'File uploaded successfully',
      document,
    }, { status: 201 })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
