'use client'

import { useState } from 'react'
import { UploadCloud, CheckCircle, Loader2, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react'

export default function SubmitProduct() {
  const [step, setStep] = useState(1) // 1: Form, 2: Simulation Timeline, 3: Result
  const [formData, setFormData] = useState({
    name: '', brand: '', category: '', batchNumber: '', supplierName: '', quantity: '1', description: ''
  })
  
  // File state
  const [productImage, setProductImage] = useState<File | null>(null)
  const [billFile, setBillFile] = useState<File | null>(null)

  // Simulation timeline state
  const [simSteps, setSimSteps] = useState([
    { id: 1, label: 'Product image uploaded', status: 'pending' },
    { id: 2, label: 'Bill uploaded', status: 'pending' },
    { id: 3, label: 'Extracting information (OCR)', status: 'pending' },
    { id: 4, label: 'Checking expiry date', status: 'pending' },
    { id: 5, label: 'Comparing bill and product', status: 'pending' },
    { id: 6, label: 'Generating verification result', status: 'pending' }
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const simulateVerification = async () => {
    setStep(2)
    
    // Simulate steps with random delays
    for (let i = 0; i < simSteps.length; i++) {
      setSimSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s))
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000))
      setSimSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'completed' } : s))
    }

    setTimeout(() => {
      setStep(3)
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productImage || !billFile) {
      alert("Please upload both product image and purchase bill.")
      return
    }
    simulateVerification()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Submit Food Product for Verification</h1>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Product Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Product Name</label>
                  <input type="text" name="name" required onChange={handleChange} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border" placeholder="e.g. Tomato Sauce" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Brand</label>
                  <input type="text" name="brand" required onChange={handleChange} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border" placeholder="e.g. ABC" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Category</label>
                  <select name="category" required onChange={handleChange} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border bg-white">
                    <option value="">Select Category</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Condiments">Condiments</option>
                    <option value="Spices">Spices</option>
                    <option value="Meat">Meat/Poultry</option>
                    <option value="Produce">Produce</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Batch/Lot Number</label>
                  <input type="text" name="batchNumber" required onChange={handleChange} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border" placeholder="e.g. B1023" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Purchase Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Supplier Name</label>
                  <input type="text" name="supplierName" required onChange={handleChange} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border" placeholder="e.g. XYZ Foods" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Quantity</label>
                  <input type="number" name="quantity" required onChange={handleChange} min="1" value={formData.quantity} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Product Description (Optional)</label>
                  <textarea name="description" onChange={handleChange} rows={4} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-2.5 px-3 border" placeholder="Additional details..." />
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
                  <p className="text-xs text-slate-500 mt-1">Make sure the Expiry Date is clearly visible</p>
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
                  <p className="text-xs text-slate-500 mt-1">Accepted: JPG, PNG, PDF (Max 5MB)</p>
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
              <button type="submit" className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors flex items-center gap-2">
                <UploadCloud className="h-5 w-5" />
                Submit and Verify
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">AI Product Verification in Progress</h2>
          <div className="w-full max-w-md space-y-6">
            {simSteps.map((s) => (
              <div key={s.id} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {s.status === 'completed' && <CheckCircle className="h-6 w-6 text-emerald-500" />}
                  {s.status === 'running' && <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />}
                  {s.status === 'pending' && <div className="h-6 w-6 rounded-full border-2 border-slate-200" />}
                </div>
                <span className={`text-lg font-medium transition-colors ${s.status === 'completed' ? 'text-slate-900' : s.status === 'running' ? 'text-blue-600' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-emerald-600 px-8 py-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-8 w-8 text-emerald-200" />
              <h2 className="text-3xl font-bold">Verification Complete</h2>
            </div>
            <p className="text-emerald-100">Your product has been analyzed by the FoodGuard AI pipeline.</p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Overall Status</h4>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-lg border border-emerald-200">
                    <CheckCircle className="h-5 w-5" />
                    VERIFIED
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">AI Confidence Scores</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Product Name Match:</span>
                      <span className="font-bold text-emerald-600">96%</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Expiry Date Confidence:</span>
                      <span className="font-bold text-emerald-600">94%</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Batch Number Match:</span>
                      <span className="font-bold text-emerald-600">91%</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Bill Validation Score:</span>
                      <span className="font-bold text-emerald-600">89%</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                  <h4 className="font-semibold text-slate-800 mb-2">Expiry Check</h4>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-emerald-700 font-semibold">SAFE / NOT EXPIRED</p>
                      <p className="text-sm text-slate-600 mt-1">Detected Expiry: <span className="font-medium text-slate-800">10/01/2027</span></p>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                  <h4 className="font-semibold text-slate-800 mb-2">Bill Verification</h4>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <div className="space-y-1 w-full">
                      <p className="text-slate-800 font-medium">Valid Purchase Invoice Found</p>
                      <ul className="text-sm text-slate-600 list-disc list-inside">
                        <li>Product matches bill</li>
                        <li>Batch number matches</li>
                        <li>Supplier matches</li>
                        <li>Quantity matches</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Officer Review Pending</p>
                <p className="text-xs text-blue-600 mt-1">Automated verification is an assistance tool. Final food safety decisions will be reviewed by an authorized food safety officer.</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={() => window.location.href = '/dashboard/hotel'} className="px-6 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-colors">
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
