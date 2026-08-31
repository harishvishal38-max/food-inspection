import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { FileText, Download, Eye } from 'lucide-react'

const prisma = new PrismaClient()

export default async function OfficerReportsPage() {
  const cookieStore = await cookies()
  const session = await decrypt(cookieStore.get('session')!.value)

  const officer = await prisma.officer.findUnique({ where: { userId: session.id } })
  if (!officer) return <div>Officer profile not found</div>

  const inspections = await prisma.inspection.findMany({
    where: { officerId: officer.id },
    include: {
      product: { include: { hotel: true } },
      violations: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Inspection Reports</h1>
        <span className="text-sm text-slate-500">{inspections.length} report{inspections.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {['Inspection ID', 'Hotel', 'Product', 'Violations', 'Action', 'Report'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inspections.map(ins => (
                <tr key={ins.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">{ins.id.slice(0, 10)}…</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">{ins.product.hotel.name}</div>
                    <div className="text-xs text-slate-400">{ins.product.hotel.fssaiNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-800">{ins.product.name}</div>
                    <div className="text-xs text-slate-400">{ins.product.batchNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    {ins.violations.length > 0 ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                        {ins.violations.length} violation{ins.violations.length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Clean</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      ins.actionTaken === 'FLAGGED' ? 'bg-orange-100 text-orange-800'
                      : ins.actionTaken === 'APPROVED' ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                    }`}>{ins.actionTaken}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                      <button className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                        <Download className="h-3.5 w-3.5" /> PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {inspections.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    No inspection reports available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
