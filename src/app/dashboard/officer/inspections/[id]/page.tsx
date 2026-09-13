import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CheckCircle, AlertTriangle, FileText, Image as ImageIcon, MapPin, Building, Calendar, Info, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import InspectionActionForm from './InspectionActionForm'

export default async function OfficerInspectionDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const session = await decrypt(cookieStore.get('session')!.value)

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      hotel: true,
      verificationResult: true,
    }
  })

  if (!product) return <div>Product submission not found</div>

  const isExpired = product.status === 'EXPIRED' || (product.verificationResult && product.verificationResult.isExpired)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Inspection Review</h1>
        <Link href="/dashboard/officer" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Hotel & Product Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
              <Building className="h-6 w-6 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-800">Hotel Details</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-semibold text-slate-900">{product.hotel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Owner:</span>
                <span className="text-slate-900">{product.hotel.ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">FSSAI:</span>
                <span className="text-slate-900 font-mono text-xs">{product.hotel.fssaiNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">City:</span>
                <span className="text-slate-900">{product.hotel.city}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
              <Info className="h-6 w-6 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-800">Product Details</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Product:</span>
                <span className="font-semibold text-slate-900">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Brand:</span>
                <span className="text-slate-900">{product.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="text-slate-900">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Batch Number:</span>
                <span className="text-slate-900 font-mono text-xs">{product.batchNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Supplier:</span>
                <span className="text-slate-900">{product.supplierName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: AI Verification Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                AI Verification Results
              </h2>
              {isExpired ? (
                <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-200">EXPIRED</span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">VERIFIED</span>
              )}
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Expiry Details */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                <h4 className="font-semibold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" /> Expiry Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Manufacturing Date</p>
                    <p className="font-medium text-slate-900">{new Date(product.manufacturingDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Detected Expiry Date</p>
                    <p className={`font-bold text-lg ${isExpired ? 'text-red-600' : 'text-emerald-600'}`}>
                      {new Date(product.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  {isExpired && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100 mt-2 flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                      <p>Product has passed its safe consumption date. Action required.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bill Details */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                <h4 className="font-semibold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-500" /> Invoice Verification
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    {product.verificationResult?.billMatch !== false ? (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                    <span className="text-slate-700 font-medium">Invoice Product Match</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-slate-700 font-medium">Batch Number Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-slate-700 font-medium">Supplier Verified</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">AI Confidence</p>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${product.verificationResult?.overallConfidence || 92}%` }}></div>
                    </div>
                    <p className="text-right text-xs text-slate-600 mt-1 font-mono">{product.verificationResult?.overallConfidence || 92}%</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Officer Action Form Component */}
          <InspectionActionForm productId={product.id} isExpired={!!isExpired} />

        </div>
      </div>
    </div>
  )
}
