import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Bell, CheckCircle } from 'lucide-react'

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default async function HotelNotifications() {
  const cookieStore = await cookies()
  const session = await decrypt(cookieStore.get('session')!.value)

  const dbNotifications = await prisma.notification.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          {dbNotifications.filter(n => !n.isRead).length} unread
        </span>
      </div>

      <div className="space-y-3">
        {dbNotifications.map(n => (
          <div
            key={n.id}
            className={`bg-white rounded-2xl border shadow-sm p-5 flex gap-4 transition-all ${
              n.isRead ? 'border-slate-100 opacity-80' : 'border-emerald-200 shadow-emerald-50'
            }`}
          >
            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
              n.isRead ? 'bg-slate-100 text-slate-400' : 'bg-emerald-100 text-emerald-600'
            }`}>
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                  {n.title}
                  {!n.isRead && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-emerald-500 align-middle" />}
                </p>
                <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">{timeAgo(n.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}

        {dbNotifications.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-400">
            No notifications yet. You will receive real-time alerts when you submit products or when officers review them.
          </div>
        )}
      </div>
    </div>
  )
}
