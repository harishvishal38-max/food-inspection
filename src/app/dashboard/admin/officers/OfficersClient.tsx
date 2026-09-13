'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, ShieldCheck, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react'

export default function OfficersClient({ officers }: { officers: any[] }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    officerId: '',
    email: '',
    password: 'password123',
    phone: '',
    department: 'Food Safety Division',
    designation: 'Food Safety Officer',
    assignedArea: 'Central District'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/admin/officers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add officer')

      setSuccess(`Officer ${formData.name} added successfully!`)
      setTimeout(() => {
        setShowModal(false)
        setSuccess('')
        setFormData({
          name: '',
          officerId: '',
          email: '',
          password: 'password123',
          phone: '',
          department: 'Food Safety Division',
          designation: 'Food Safety Officer',
          assignedArea: 'Central District'
        })
        router.refresh()
      }, 1000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Officers</h1>
          <p className="text-sm text-slate-500 mt-1">{officers.length} active safety officers in system</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm text-sm"
        >
          <UserPlus className="h-4 w-4" />
          Add New Officer
        </button>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {officers.map(o => (
          <div key={o.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-lg">
                {o.name[0]}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{o.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{o.officerId}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Email:</span> <span className="font-mono text-xs text-slate-700">{o.user?.email}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Department:</span> {o.department}
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Designation:</span> {o.designation}
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Assigned Area:</span> <span className="font-semibold text-slate-800">{o.assignedArea}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <div className="flex-1 text-center">
                <p className="text-xl font-bold text-slate-900">{o.inspections.length}</p>
                <p className="text-xs text-slate-500">Inspections</p>
              </div>
              <div className="w-px bg-slate-100" />
              <div className="flex-1 text-center">
                <p className="text-xl font-bold text-red-600">{o.violations.length}</p>
                <p className="text-xs text-slate-500">Violations</p>
              </div>
            </div>
          </div>
        ))}

        {officers.length === 0 && (
          <div className="col-span-3 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            No officers registered yet. Click &quot;Add New Officer&quot; to register your first safety inspector.
          </div>
        )}
      </div>

      {/* Add Officer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-slate-900">Register New Food Safety Officer</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-sm border border-emerald-200 flex items-center gap-2 font-semibold">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleCreateOfficer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Inspector Ramesh" className="w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 py-2 px-3 border text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Officer ID *</label>
                  <input type="text" name="officerId" required value={formData.officerId} onChange={handleChange} placeholder="e.g. OFF-KA-002" className="w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 py-2 px-3 border text-sm font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="officer2@example.com" className="w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 py-2 px-3 border text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Default Password *</label>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 py-2 px-3 border text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Department</label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 py-2 px-3 border text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Designation</label>
                  <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 py-2 px-3 border text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Assigned Territory / Area</label>
                <input type="text" name="assignedArea" value={formData.assignedArea} onChange={handleChange} placeholder="e.g. South Bangalore Zone" className="w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 py-2 px-3 border text-sm" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  Save Officer to DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
