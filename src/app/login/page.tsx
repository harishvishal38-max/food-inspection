'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Login failed')

      if (data.role === 'HOTEL') router.push('/dashboard/hotel')
      else if (data.role === 'OFFICER') router.push('/dashboard/officer')
      else if (data.role === 'ADMIN') router.push('/dashboard/admin')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
      <form className="space-y-6" onSubmit={handleLogin}>
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 text-center">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700">Email address</label>
          <div className="mt-2 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="block w-full pl-10 py-3 border border-slate-300 rounded-xl bg-white/50 text-sm outline-none focus:border-emerald-500 transition-colors"
              placeholder="hotel@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <div className="mt-2 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="block w-full pl-10 py-3 border border-slate-300 rounded-xl bg-white/50 text-sm outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input id="remember-me" type="checkbox" className="h-4 w-4 text-emerald-600 border-slate-300 rounded" />
            <label htmlFor="remember-me" className="text-sm text-slate-900">Remember me</label>
          </div>
          <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-all disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign in'}
        </button>
      </form>

      {/* Demo credentials hint */}
      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-xs font-semibold text-slate-600 mb-2">Demo Accounts (password: password123)</p>
        <div className="space-y-1 text-xs text-slate-500">
          <p>🏨 <span className="font-mono">hotel@example.com</span> — Hotel User</p>
          <p>🛡️ <span className="font-mono">officer@example.com</span> — Food Safety Officer</p>
          <p>⚙️ <span className="font-mono">admin@example.com</span> — Admin</p>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-slate-600">
        Don&apos;t have a hotel account?{' '}
        <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
          Register now
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center text-emerald-600 mb-6">
          <ShieldCheck className="h-16 w-16" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back to FoodGuard
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">Sign in to your account to continue</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Suspense fallback={<div className="text-center text-slate-500 text-sm">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
