import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    // Demo login for testing - creates a JWT token for the demo user
    const { email } = await request.json()
    
    if (email === 'demo@findocai.com') {
      const token = jwt.sign(
        { 
          userId: 'cmb6ko6j100004hjtn9b16vig', // Demo user ID
          email: 'demo@findocai.com' 
        },
        process.env.JWT_SECRET || 'demo-secret',
        { expiresIn: '24h' }
      )
      
      return NextResponse.json({
        success: true,
        token,
        user: {
          id: 'cmb6ko6j100004hjtn9b16vig',
          email: 'demo@findocai.com',
          name: 'Demo User'
        }
      })
    }
    
    return NextResponse.json(
      { error: 'Demo login only available for demo@findocai.com' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Error in demo login:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
