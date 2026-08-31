import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { AlertTriangle, CheckCircle, Building, Users, PackageSearch } from 'lucide-react'

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Manage Hotels</h1>
        <span className="text-sm text-slate-500">{hotels.length} registered</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {['Hotel', 'FSSAI Number', 'City', 'Products', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hotels.map(hotel => (
                <tr key={hotel.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                        {hotel.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{hotel.name}</div>
                        <div className="text-xs text-slate-400">{hotel.ownerName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-600">{hotel.fssaiNumber}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{hotel.city}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-medium">{hotel.products.length}</td>
                  <td className="px-6 py-4">
                    {hotel.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle className="h-3.5 w-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        <AlertTriangle className="h-3.5 w-3.5" /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
