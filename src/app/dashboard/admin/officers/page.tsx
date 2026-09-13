import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OfficersClient from './OfficersClient'

export default async function AdminOfficersPage() {
  const cookieStore = await cookies()
  const session = await decrypt(cookieStore.get('session')!.value)
  if (session.role !== 'ADMIN') return <div>Access denied</div>

  const officers = await prisma.officer.findMany({
    include: {
      user: true,
      inspections: true,
      violations: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  return <OfficersClient officers={officers} />
}
