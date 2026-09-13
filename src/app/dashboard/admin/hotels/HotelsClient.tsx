'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'

export default function HotelsClient({ hotels }: { hotels: any[] }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleToggleVerify = async (id: string) => {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/hotels/${id}/verify`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to update verification status')
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Error updating hotel')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Hotels & Restaurants</h1>
          <p className="text-sm text-slate-500 mt-1">{hotels.length} registered establishments</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {['Hotel / Restaurant', 'FSSAI License', 'City / Location', 'Products', 'Status', 'Verification Action'].map(h => (
                  <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hotels.map(hotel => (
                <tr key={hotel.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                        {hotel.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{hotel.name}</div>
                        <div className="text-xs text-slate-500">Owner: {hotel.ownerName} · {hotel.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-700 font-semibold">{hotel.fssaiNumber}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{hotel.city}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-semibold">{hotel.products.length}</td>
                  <td className="px-6 py-4">
                    {hotel.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle className="h-3.5 w-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <AlertTriangle className="h-3.5 w-3.5" /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleVerify(hotel.id)}
                      disabled={loadingId === hotel.id}
                      className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 ${
                        hotel.isVerified
                          ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {loadingId === hotel.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {hotel.isVerified ? 'Revoke Verification' : 'Approve & Verify'}
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
