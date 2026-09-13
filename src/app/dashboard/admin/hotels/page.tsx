import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import HotelsClient from './HotelsClient'

export default async function AdminHotelsPage() {
  const cookieStore = await cookies()
  const session = await decrypt(cookieStore.get('session')!.value)
  if (session.role !== 'ADMIN') return <div>Access denied</div>

  const hotels = await prisma.hotel.findMany({
    include: {
      user: true,
      products: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  return <HotelsClient hotels={hotels} />
}
