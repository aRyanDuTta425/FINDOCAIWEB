import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  console.log('Signup route called')
  
  try {
    // Import dependencies dynamically
    const { PrismaClient } = await import('@prisma/client')
    const bcrypt = await import('bcryptjs')
    const jwt = await import('jsonwebtoken')
    
    const prisma = new PrismaClient()
    
    let requestData
    try {
      requestData = await request.json()
      console.log('Request data received:', { email: requestData.email, hasPassword: !!requestData.password })
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { email, password, name } = requestData

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Test database connection first
    try {
      await prisma.$connect()
      console.log('Database connected successfully')
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
        { status: 500 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      await prisma.$disconnect()
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password and create user
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    })

    console.log('User created successfully:', user.id)

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Create response with token in cookie
    const response = NextResponse.json({
      message: 'User created successfully',
      user,
      token,
    }, { status: 201 })

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    await prisma.$disconnect()
    return response
    
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// Add OPTIONS method for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
