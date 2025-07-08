import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  console.log('Login route called')
  
  try {
    // Import dependencies dynamically
    const { PrismaClient } = await import('@prisma/client')
    const bcrypt = await import('bcryptjs')
    const jwt = await import('jsonwebtoken')
    
    const prisma = new PrismaClient()
    
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Test database connection
    try {
      await prisma.$connect()
      console.log('Database connected for login')
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      await prisma.$disconnect()
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      await prisma.$disconnect()
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }

    // Create response with token in cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: userResponse,
      token,
    })

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
    console.error('Login error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
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
