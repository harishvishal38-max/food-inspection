import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AlertTriangle } from 'lucide-react'

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-800 border-red-200',
  HIGH:     'bg-orange-100 text-orange-800 border-orange-200',
  MEDIUM:   'bg-amber-100 text-amber-800 border-amber-200',
  LOW:      'bg-blue-100 text-blue-800 border-blue-200',
}

const STATUS_COLORS: Record<string, string> = {
  OPEN:         'bg-red-50 text-red-700',
  UNDER_REVIEW: 'bg-amber-50 text-amber-700',
  RESOLVED:     'bg-emerald-50 text-emerald-700',
  ESCALATED:    'bg-purple-50 text-purple-700',
}

export default async function AdminViolationsPage() {
  const cookieStore = await cookies()
  const session = await decrypt(cookieStore.get('session')!.value)
  if (session.role !== 'ADMIN') return <div>Access denied</div>

  const violations = await prisma.violation.findMany({
    include: {
      officer: true,
      inspection: {
        include: {
          product: {
            include: { hotel: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Violations</h1>
          <p className="text-sm text-slate-500 mt-1">All recorded food safety violations across all hotels.</p>
        </div>
        <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
          {violations.filter(v => v.status === 'OPEN').length} Open Violations
        </span>
      </div>

      <div className="grid gap-4">
        {violations.map(v => (
          <div key={v.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">{v.type}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${SEVERITY_COLORS[v.severity] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {v.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    🏨 {v.inspection.product.hotel.name} · Product: {v.inspection.product.name} ({v.inspection.product.batchNumber})
                  </p>
                  <p className="text-sm text-slate-500">
                    🛡️ Reported by: {v.officer.name} ({v.officer.department})
                  </p>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{v.description}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[v.status] ?? 'bg-slate-50 text-slate-600'}`}>
                  {v.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400">{new Date(v.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}

        {violations.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <p className="text-slate-600 font-medium">No violations recorded across the system.</p>
          </div>
        )}
      </div>
    </div>
  )
}
