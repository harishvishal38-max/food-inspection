'use client'

import { useState, useEffect } from 'react'
import { Building, Users, AlertTriangle, PackageSearch } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    // In a real app, this would fetch from an API
    // Setting dummy data for demo purposes since we're using a client component for charts
    setStats({
      totalHotels: 45,
      verifiedHotels: 38,
      totalOfficers: 12,
      totalInspections: 128,
      pendingInspections: 14,
      violations: 23,
      expiredProducts: 18
    })
  }, [])

  if (!stats) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>

  const monthlyData = [
    { name: 'Jan', inspections: 15, violations: 2 },
    { name: 'Feb', inspections: 20, violations: 4 },
    { name: 'Mar', inspections: 25, violations: 3 },
    { name: 'Apr', inspections: 22, violations: 5 },
    { name: 'May', inspections: 30, violations: 7 },
    { name: 'Jun', inspections: 28, violations: 4 },
  ]

  const violationData = [
    { name: 'Expired Product', value: 12, color: '#ef4444' },
    { name: 'Label Mismatch', value: 5, color: '#f59e0b' },
    { name: 'No Bill Found', value: 4, color: '#3b82f6' },
    { name: 'Storage Issue', value: 2, color: '#8b5cf6' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard & Analytics</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Hotels</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalHotels}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Officers</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalOfficers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mr-4">
            <PackageSearch className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Inspections</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalInspections}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
          <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mr-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Violations</p>
            <p className="text-2xl font-bold text-slate-900">{stats.violations}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Inspections Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Inspections vs Violations (6 Months)</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="inspections" name="Inspections" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="violations" name="Violations" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations by Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Violations by Category</h2>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={violationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {violationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
