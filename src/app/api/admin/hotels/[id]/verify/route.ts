import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await decrypt(sessionCookie)
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 })
    }

    const hotel = await prisma.hotel.findUnique({
      where: { id }
    })

    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }

    const updatedHotel = await prisma.hotel.update({
      where: { id },
      data: { isVerified: !hotel.isVerified }
    })

    return NextResponse.json({ success: true, hotel: updatedHotel })
  } catch (error: any) {
    console.error('Verify hotel error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to update hotel verification' }, { status: 500 })
  }
}
