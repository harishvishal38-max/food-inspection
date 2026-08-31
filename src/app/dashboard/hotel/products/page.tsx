import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { PackagePlus, CheckCircle, AlertTriangle, Clock, Package } from 'lucide-react'

const prisma = new PrismaClient()

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    VERIFIED: 'bg-emerald-100 text-emerald-800',
    PENDING:  'bg-amber-100 text-amber-800',
    EXPIRED:  'bg-red-100 text-red-800',
    FLAGGED:  'bg-orange-100 text-orange-800',
    REJECTED: 'bg-slate-100 text-slate-600',
  }
  return (
    <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${map[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

export default async function HotelProductsPage() {
  const cookieStore = await cookies()
  const session = await decrypt(cookieStore.get('session')!.value)

  const hotel = await prisma.hotel.findUnique({ where: { userId: session.id } })
  if (!hotel) return <div>Hotel not found</div>

  const products = await prisma.product.findMany({
    where: { hotelId: hotel.id },
    include: { verificationResult: true, inspection: true },
    orderBy: { createdAt: 'desc' },
  })

  const stats = {
    total: products.length,
    verified: products.filter(p => p.status === 'VERIFIED').length,
    pending: products.filter(p => p.status === 'PENDING').length,
    expired: products.filter(p => p.status === 'EXPIRED').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Products</h1>
        <Link
          href="/dashboard/hotel/submit"
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <PackagePlus className="h-4 w-4" />
          Submit New Product
        </Link>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: Package, color: 'bg-blue-100 text-blue-600' },
          { label: 'Verified', value: stats.verified, icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-100 text-amber-600' },
          { label: 'Expired / Flagged', value: stats.expired, icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">All Submissions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {['Product', 'Category', 'Batch No.', 'Expiry Date', 'Confidence', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.brand} · {p.supplierName}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{p.category}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{p.batchNumber}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${new Date(p.expiryDate) < new Date() ? 'text-red-600' : 'text-slate-800'}`}>
                      {new Date(p.expiryDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {p.verificationResult ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${p.verificationResult.overallConfidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-slate-600">{p.verificationResult.overallConfidence}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400 italic">
                      {p.inspection ? 'Reviewed' : 'Awaiting review'}
                    </span>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">
                    No products submitted yet.{' '}
                    <Link href="/dashboard/hotel/submit" className="text-emerald-600 font-medium hover:underline">Submit your first product →</Link>
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
