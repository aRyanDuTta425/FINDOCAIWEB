import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

    // Fetch user data from database
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    })

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: userData
    })
  } catch (error) {
    console.error('Me route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
