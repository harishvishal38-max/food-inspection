import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await decrypt(sessionCookie)
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 })
    }

    const data = await request.json()
    const { email, password, name, officerId, phone, department, designation, assignedArea } = data

    if (!email || !password || !name || !officerId) {
      return NextResponse.json({ error: 'Email, password, name, and officer ID are required.' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 400 })
    }

    const existingOfficer = await prisma.officer.findUnique({
      where: { officerId }
    })

    if (existingOfficer) {
      return NextResponse.json({ error: 'Officer ID already exists.' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        role: 'OFFICER',
        officer: {
          create: {
            name,
            officerId,
            phone: phone || '9876543210',
            department: department || 'Food Safety Inspection',
            designation: designation || 'Food Safety Officer',
            assignedArea: assignedArea || 'Central Zone'
          }
        }
      },
      include: {
        officer: true
      }
    })

    return NextResponse.json({ success: true, officer: user.officer })
  } catch (error: any) {
    console.error('Create officer error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create officer' }, { status: 500 })
  }
}
