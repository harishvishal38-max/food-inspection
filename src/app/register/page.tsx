'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Mail, Lock, Building, Phone, MapPin, Hash, User, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    fssaiNumber: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }
      
      router.push('/login?registered=true')
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center relative overflow-hidden py-12">
      {/* Background Elements */}
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-emerald-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000" />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="flex justify-center text-emerald-600 mb-6">
          <ShieldCheck className="h-12 w-12" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Register Your Hotel
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 mb-8">
          Join FoodGuard and digitize your food safety compliance
        </p>

        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center justify-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hotel Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Hotel/Restaurant Name</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="text" name="name" required onChange={handleChange} value={formData.name}
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 bg-white/50 border outline-none transition-colors"
                    placeholder="Green Leaf Restaurant" />
                </div>
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Owner Name</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="text" name="ownerName" required onChange={handleChange} value={formData.ownerName}
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 bg-white/50 border outline-none transition-colors"
                    placeholder="John Doe" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Email Address</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="email" name="email" required onChange={handleChange} value={formData.email}
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 bg-white/50 border outline-none transition-colors"
                    placeholder="hotel@example.com" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="tel" name="phone" required onChange={handleChange} value={formData.phone}
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 bg-white/50 border outline-none transition-colors"
                    placeholder="9876543210" />
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Full Address</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="text" name="address" required onChange={handleChange} value={formData.address}
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 bg-white/50 border outline-none transition-colors"
                    placeholder="123 Food Street, Phase 1" />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-slate-700">City</label>
                <input type="text" name="city" required onChange={handleChange} value={formData.city}
                  className="mt-2 focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-slate-300 rounded-xl py-3 px-4 bg-white/50 border outline-none transition-colors"
                  placeholder="Bangalore" />
              </div>

              {/* FSSAI Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700">License/FSSAI Number</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="text" name="fssaiNumber" required onChange={handleChange} value={formData.fssaiNumber}
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 bg-white/50 border outline-none transition-colors"
                    placeholder="FSSAI12345678" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="password" name="password" required onChange={handleChange} value={formData.password}
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 bg-white/50 border outline-none transition-colors"
                    placeholder="••••••••" />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="password" name="confirmPassword" required onChange={handleChange} value={formData.confirmPassword}
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 bg-white/50 border outline-none transition-colors"
                    placeholder="••••••••" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Register Hotel'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
