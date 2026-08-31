import { cookies } from 'next/headers'
import { decrypt } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function AdminOfficersPage() {
  const cookieStore = await cookies()
  const session = await decrypt(cookieStore.get('session')!.value)
  if (session.role !== 'ADMIN') return <div>Access denied</div>

  const officers = await prisma.officer.findMany({
    include: {
      user: true,
      inspections: true,
      violations: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Manage Officers</h1>
        <span className="text-sm text-slate-500">{officers.length} active officers</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {officers.map(o => (
          <div key={o.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-lg">
                {o.name[0]}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{o.name}</h3>
                <p className="text-xs text-slate-500">{o.officerId}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Department:</span> {o.department}
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Designation:</span> {o.designation}
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Assigned Area:</span> {o.assignedArea}
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
            No officers registered yet.
          </div>
        )}
      </div>
    </div>
  )
}
