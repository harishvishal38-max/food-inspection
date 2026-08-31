import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate hotel registration fields
    const { email, password, name, ownerName, phone, address, city, fssaiNumber } = data

    if (!email || !password || !name || !ownerName || !phone || !address || !city || !fssaiNumber) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Create user and hotel
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        role: 'HOTEL',
        hotel: {
          create: {
            name,
            ownerName,
            phone,
            address,
            city,
            fssaiNumber
          }
        }
      }
    })

    return NextResponse.json({ success: true, message: 'Registration successful' })
  } catch (error: any) {
    console.error('Registration error:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'FSSAI Number or Email already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
