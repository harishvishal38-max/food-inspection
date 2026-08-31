import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Bell, CheckCircle } from 'lucide-react'

const DEMO_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Product Verification Complete',
    message: 'Your submission "Milk (FreshCow)" has been verified by the AI system. Awaiting officer sign-off.',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Expired Product Detected',
    message: 'AI scan detected that "Tomato Sauce (ABC · B1023)" may be expired. A food safety officer has been notified.',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Inspection Report Available',
    message: 'An inspection report for "Cooking Oil" has been generated and is available for download.',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    title: 'Officer Review Completed',
    message: 'Inspector Ramesh has reviewed your product "Packaged Juice" and approved it. No violations found.',
    isRead: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
]

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default async function HotelNotifications() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          {DEMO_NOTIFICATIONS.filter(n => !n.isRead).length} unread
        </span>
      </div>

      <div className="space-y-3">
        {DEMO_NOTIFICATIONS.map(n => (
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
      </div>

      <div className="flex justify-center">
        <button className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
          <CheckCircle className="h-4 w-4" />
          Mark all as read
        </button>
      </div>
    </div>
  )
}
