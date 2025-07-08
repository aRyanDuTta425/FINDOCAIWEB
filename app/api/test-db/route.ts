import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // First check if environment variables exist
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL environment variable not found',
        env: {
          hasDbUrl: false,
          hasJwtSecret: !!process.env.JWT_SECRET,
          nodeEnv: process.env.NODE_ENV
        }
      }, { status: 500 })
    }

    // Try to import and use Prisma
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    // Test connection
    await prisma.$connect()
    
    // Try a simple query
    const userCount = await prisma.user.count()
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      userCount,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 })
  }
}
