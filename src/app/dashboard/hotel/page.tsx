import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PackageSearch, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export default async function HotelDashboard() {
  const cookieStore = await cookies()
  const session = await decrypt(cookieStore.get('session')!.value)

  const hotel = await prisma.hotel.findUnique({
    where: { userId: session.id },
    include: {
      products: true
    }
  })

  if (!hotel) return <div>Hotel profile not found</div>

  const totalProducts = hotel.products.length
  const verifiedProducts = hotel.products.filter(p => p.status === 'VERIFIED').length
  const pendingProducts = hotel.products.filter(p => p.status === 'PENDING').length
  const expiredProducts = hotel.products.filter(p => p.status === 'EXPIRED').length

  const recentProducts = await prisma.product.findMany({
    where: { hotelId: hotel.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      inspection: true
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
            <PackageSearch className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Submitted</p>
            <p className="text-2xl font-bold text-slate-900">{totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mr-4">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Verified</p>
            <p className="text-2xl font-bold text-slate-900">{verifiedProducts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mr-4">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Review</p>
            <p className="text-2xl font-bold text-slate-900">{pendingProducts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mr-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Expired/Flagged</p>
            <p className="text-2xl font-bold text-slate-900">{expiredProducts}</p>
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Recent Submissions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {recentProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{product.name}</div>
                    <div className="text-sm text-slate-500">{product.brand} • {product.batchNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(product.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${product.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 
                        product.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 
                        product.status === 'EXPIRED' || product.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        'bg-slate-100 text-slate-800'}`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                    No products submitted yet.
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
