import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decrypt } from '@/lib/auth'
import DashboardSidebar from './Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  
  if (!sessionCookie) {
    redirect('/login')
  }

  let session: any
  try {
    session = await decrypt(sessionCookie)
  } catch {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <DashboardSidebar role={session.role} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6">
          <div className="font-semibold text-slate-800">
            {session.role === 'HOTEL' && 'Hotel Portal'}
            {session.role === 'OFFICER' && 'Officer Portal'}
            {session.role === 'ADMIN' && 'Admin Portal'}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500">{session.email}</span>
            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              {session.email[0].toUpperCase()}
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
