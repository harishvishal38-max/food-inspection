'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react'

export default function InspectionActionForm({
  productId,
  isExpired
}: {
  productId: string
  isExpired: boolean
}) {
  const router = useRouter()
  const [comments, setComments] = useState('')
  const [violationType, setViolationType] = useState('Expired Food Product')
  const [severity, setSeverity] = useState('HIGH')
  const [violationDescription, setViolationDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleAction = async (actionTaken: 'APPROVED' | 'REJECTED' | 'FLAGGED') => {
    setSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          actionTaken,
          comments,
          violationType: (actionTaken === 'REJECTED' || actionTaken === 'FLAGGED') ? violationType : undefined,
          severity: (actionTaken === 'REJECTED' || actionTaken === 'FLAGGED') ? severity : undefined,
          violationDescription: (actionTaken === 'REJECTED' || actionTaken === 'FLAGGED') ? (violationDescription || comments) : undefined
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit inspection')

      setSuccessMsg(`Inspection recorded successfully! Action: ${actionTaken}`)
      setTimeout(() => {
        router.push('/dashboard/officer')
        router.refresh()
      }, 1200)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error recording inspection')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Officer Decision & Action</h3>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-semibold border border-emerald-200 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Inspection Notes / Official Comments</label>
        <textarea
          rows={3}
          value={comments}
          onChange={e => setComments(e.target.value)}
          className="w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border text-sm"
          placeholder="Enter findings, physical inspection observations, or disposal directives..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Violation Type (If applicable)</label>
          <select
            value={violationType}
            onChange={e => setViolationType(e.target.value)}
            className="w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 py-2 px-3 border bg-white text-sm"
          >
            <option value="Expired Food Product">Expired Food Product</option>
            <option value="Improper Labeling / Mislabeled">Improper Labeling / Mislabeled</option>
            <option value="Unregistered / Unapproved Batch">Unregistered / Unapproved Batch</option>
            <option value="Invoice Mismatch / Counterfeit">Invoice Mismatch / Counterfeit</option>
            <option value="Improper Storage Conditions">Improper Storage Conditions</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Severity Level</label>
          <select
            value={severity}
            onChange={e => setSeverity(e.target.value)}
            className="w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 py-2 px-3 border bg-white text-sm"
          >
            <option value="LOW">LOW — Minor label discrepancy</option>
            <option value="MEDIUM">MEDIUM — Missing batch record</option>
            <option value="HIGH">HIGH — Expired or tainted batch</option>
            <option value="CRITICAL">CRITICAL — Immediate health hazard</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Violation Summary (Optional)</label>
          <input
            type="text"
            value={violationDescription}
            onChange={e => setViolationDescription(e.target.value)}
            placeholder="e.g. Discovered expired dairy batch with falsified dates"
            className="w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 py-2 px-3 border bg-white text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleAction('APPROVED')}
          className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          Approve Verification
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleAction('REJECTED')}
          className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
          Log Violation & Reject
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleAction('FLAGGED')}
          className="flex-1 bg-slate-800 text-white py-3 px-4 rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-4 w-4" />}
          Flag for Review
        </button>
      </div>
    </div>
  )
}
