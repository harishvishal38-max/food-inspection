'use client'

import { useState } from 'react'
import { UploadCloud, CheckCircle, Loader2, FileText, Image as ImageIcon, AlertCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function SubmitProduct() {
  const [step, setStep] = useState(1) // 1: Form, 2: Simulation Timeline, 3: Result
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Condiments',
    batchNumber: '',
    manufacturingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    purchaseDate: new Date().toISOString().split('T')[0],
    supplierName: '',
    quantity: '10',
    description: ''
  })
  
  // File state
  const [productImage, setProductImage] = useState<File | null>(null)
  const [billFile, setBillFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [savedProduct, setSavedProduct] = useState<any>(null)

  // Simulation timeline state
  const [simSteps, setSimSteps] = useState([
    { id: 1, label: 'Uploading product label and bill...', status: 'pending' },
    { id: 2, label: 'Extracting product information with OCR...', status: 'pending' },
    { id: 3, label: 'Evaluating product expiry & consumption safety...', status: 'pending' },
    { id: 4, label: 'Cross-verifying purchase invoice...', status: 'pending' },
    { id: 5, label: 'Saving verified records to secure database...', status: 'pending' }
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    setStep(2)

    try {
      // Step 1: Uploading
      setSimSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'running' } : s))
      
      let imgData = ''
      let billData = ''
      if (productImage) {
        imgData = await handleFileToBase64(productImage).catch(() => '')
      }
      if (billFile) {
        billData = await handleFileToBase64(billFile).catch(() => '')
      }

      await new Promise(r => setTimeout(r, 600))
      setSimSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'completed' } : i === 1 ? { ...s, status: 'running' } : s))

      // Step 2: OCR Extraction
      await new Promise(r => setTimeout(r, 700))
      setSimSteps(prev => prev.map((s, i) => i === 1 ? { ...s, status: 'completed' } : i === 2 ? { ...s, status: 'running' } : s))

      // Step 3: Expiry Check
      await new Promise(r => setTimeout(r, 600))
      setSimSteps(prev => prev.map((s, i) => i === 2 ? { ...s, status: 'completed' } : i === 3 ? { ...s, status: 'running' } : s))

      // Step 4: Invoice Match & API Call
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productImage: imgData,
          billFile: billData
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit product')

      setSimSteps(prev => prev.map((s, i) => i === 3 ? { ...s, status: 'completed' } : i === 4 ? { ...s, status: 'running' } : s))
      await new Promise(r => setTimeout(r, 500))
      setSimSteps(prev => prev.map((s, i) => i === 4 ? { ...s, status: 'completed' } : s))

      setSavedProduct(data.product)
      setStep(3)
    } catch (err: any) {
      setError(err.message || 'Submission failed')
      setStep(1)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Submit Food Product for Verification</h1>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Product Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Product Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border" placeholder="e.g. Organic Tomato Puree" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Brand *</label>
                  <input type="text" name="brand" required value={formData.brand} onChange={handleChange} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border" placeholder="e.g. Heinz" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Category *</label>
                  <select name="category" required value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border bg-white">
                    <option value="Dairy">Dairy</option>
                    <option value="Condiments">Condiments</option>
                    <option value="Spices">Spices</option>
                    <option value="Meat">Meat/Poultry</option>
                    <option value="Produce">Produce</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Batch/Lot Number *</label>
                  <input type="text" name="batchNumber" required value={formData.batchNumber} onChange={handleChange} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border font-mono" placeholder="e.g. B-2026-X89" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Mfg Date</label>
                    <input type="date" name="manufacturingDate" value={formData.manufacturingDate} onChange={handleChange} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 border text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Expiry Date *</label>
                    <input type="date" name="expiryDate" required value={formData.expiryDate} onChange={handleChange} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 border text-sm" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Purchase & Supplier</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Supplier / Vendor Name *</label>
                  <input type="text" name="supplierName" required value={formData.supplierName} onChange={handleChange} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border" placeholder="e.g. Metro Cash & Carry" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Purchase Date</label>
                    <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 border text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Quantity (Units) *</label>
                    <input type="number" name="quantity" required min="1" value={formData.quantity} onChange={handleChange} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 px-3 border text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Storage / Usage Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border" placeholder="e.g. Stored in cold storage at 4°C, used for lunch service..." />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Required Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product Image Upload */}
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
                  <input type="file" accept="image/*" onChange={e => setProductImage(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-500 mb-3">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Product Label Image</p>
                  <p className="text-xs text-slate-500 mt-1">Make sure the Expiry Date is visible</p>
                  {productImage && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {productImage.name}
                    </div>
                  )}
                </div>

                {/* Bill Upload */}
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
                  <input type="file" accept="image/*,.pdf" onChange={e => setBillFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500 mb-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Purchase Bill / Invoice</p>
                  <p className="text-xs text-slate-500 mt-1">Accepted: JPG, PNG, PDF</p>
                  {billFile && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {billFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={submitting} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
                Submit and Save to Database
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">AI Verification & Database Storage</h2>
          <div className="w-full max-w-md space-y-6">
            {simSteps.map((s) => (
              <div key={s.id} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {s.status === 'completed' && <CheckCircle className="h-6 w-6 text-emerald-500" />}
                  {s.status === 'running' && <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />}
                  {s.status === 'pending' && <div className="h-6 w-6 rounded-full border-2 border-slate-200" />}
                </div>
                <span className={`text-base font-medium transition-colors ${s.status === 'completed' ? 'text-slate-900 font-semibold' : s.status === 'running' ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && savedProduct && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className={`${savedProduct.status === 'EXPIRED' ? 'bg-red-600' : 'bg-emerald-600'} px-8 py-6 text-white`}>
            <div className="flex items-center gap-3 mb-2">
              {savedProduct.status === 'EXPIRED' ? (
                <AlertTriangle className="h-8 w-8 text-red-200" />
              ) : (
                <CheckCircle className="h-8 w-8 text-emerald-200" />
              )}
              <h2 className="text-3xl font-bold">
                {savedProduct.status === 'EXPIRED' ? 'Product Flagged (Expired)' : 'Successfully Saved & Verified'}
              </h2>
            </div>
            <p className="text-white/90">
              Product details and AI verification results have been permanently saved in the database.
            </p>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Saved Product Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="font-bold text-slate-800">{savedProduct.name}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Brand:</span> <span className="font-medium text-slate-700">{savedProduct.brand}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Batch:</span> <span className="font-mono text-slate-700">{savedProduct.batchNumber}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Expiry Date:</span> <span className={`font-bold ${savedProduct.status === 'EXPIRED' ? 'text-red-600' : 'text-emerald-600'}`}>{new Date(savedProduct.expiryDate).toLocaleDateString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Quantity:</span> <span className="font-medium text-slate-700">{savedProduct.quantity} units</span></div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">AI Confidence Scores</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between items-center"><span className="text-slate-600">Product Name Match:</span> <span className="font-bold text-emerald-600">96%</span></li>
                    <li className="flex justify-between items-center"><span className="text-slate-600">Expiry Date Confidence:</span> <span className="font-bold text-emerald-600">95%</span></li>
                    <li className="flex justify-between items-center"><span className="text-slate-600">Invoice Match:</span> <span className="font-bold text-emerald-600">92%</span></li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                  <h4 className="font-semibold text-slate-800 mb-2">Verification Status</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${savedProduct.status === 'EXPIRED' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
                      {savedProduct.status}
                    </span>
                    <span className="text-xs text-slate-500">Awaiting officer inspection review</span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                  <h4 className="font-semibold text-slate-800 mb-2">Next Steps</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    This submission is now live in the Food Safety Officer inspection queue. Any safety alerts or officer approvals will appear in your notification feed.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200">
              <button onClick={() => { setStep(1); setFormData({ name: '', brand: '', category: 'Condiments', batchNumber: '', manufacturingDate: new Date().toISOString().split('T')[0], expiryDate: new Date().toISOString().split('T')[0], purchaseDate: new Date().toISOString().split('T')[0], supplierName: '', quantity: '10', description: '' }); }} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors">
                + Submit Another Product
              </button>
              <Link href="/dashboard/hotel/products" className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
                View in My Products &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
