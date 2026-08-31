import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { encrypt } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ id: user.id, role: user.role, email: user.email, expires })

    const response = NextResponse.json({ success: true, role: user.role })
    
    response.cookies.set({
      name: 'session',
      value: session,
      httpOnly: true,
      expires: expires,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
