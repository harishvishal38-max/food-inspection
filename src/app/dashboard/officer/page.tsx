import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PackageSearch, AlertTriangle, FileText, Activity } from 'lucide-react'

export default async function OfficerDashboard() {
  const cookieStore = await cookies()
  const session = await decrypt(cookieStore.get('session')!.value)

  const officer = await prisma.officer.findUnique({
    where: { userId: session.id }
  })

  if (!officer) return <div>Officer profile not found</div>

  const pendingCount = await prisma.product.count({ where: { status: 'PENDING' } })
  const completedCount = await prisma.inspection.count({ where: { officerId: officer.id } })
  const violationsCount = await prisma.violation.count({ where: { officerId: officer.id } })
  const expiredCount = await prisma.product.count({ where: { status: 'EXPIRED' } })

  const pendingInspections = await prisma.product.findMany({
    where: { status: 'PENDING' },
    include: { hotel: true },
    take: 10,
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Officer Dashboard</h1>
        <div className="text-sm text-slate-500">
          Assigned Area: <span className="font-semibold text-slate-800">{officer.assignedArea}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mr-4">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Inspections</p>
            <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
            <PackageSearch className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Inspections Completed</p>
            <p className="text-2xl font-bold text-slate-900">{completedCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mr-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Violations Logged</p>
            <p className="text-2xl font-bold text-slate-900">{violationsCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mr-4">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Expired Products</p>
            <p className="text-2xl font-bold text-slate-900">{expiredCount}</p>
          </div>
        </div>
      </div>

      {/* Pending Inspections */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Inspection Queue</h2>
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">{pendingCount} Action Required</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Hotel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">AI Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {pendingInspections.map((product) => {
                // Simulate AI confidence risk
                const isHighRisk = product.status === 'EXPIRED' || new Date(product.expiryDate).getTime() < Date.now();
                
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{product.hotel.name}</div>
                      <div className="text-sm text-slate-500">{product.hotel.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{product.name}</div>
                      <div className="text-sm text-slate-500">{product.batchNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isHighRisk ? (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                           <AlertTriangle className="h-3.5 w-3.5" /> High Risk
                         </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                           Pending Review
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/dashboard/officer/inspections/${product.id}`} className="text-emerald-600 hover:text-emerald-900 font-semibold bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors">
                        Review
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {pendingInspections.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                    No pending inspections in your queue.
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
