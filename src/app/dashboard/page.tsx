import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardRootPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  if (!sessionCookie) redirect('/login')

  const session = await decrypt(sessionCookie)

  if (session.role === 'HOTEL') redirect('/dashboard/hotel')
  if (session.role === 'OFFICER') redirect('/dashboard/officer')
  if (session.role === 'ADMIN') redirect('/dashboard/admin')

  redirect('/login')
}
