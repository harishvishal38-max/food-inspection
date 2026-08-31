'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  ShieldCheck, 
  LayoutDashboard, 
  PackagePlus, 
  PackageSearch, 
  AlertTriangle, 
  FileText, 
  Bell, 
  LogOut,
  Users,
  Building
} from 'lucide-react'

export default function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname()
  const router = useRouter()
  
  const hotelLinks = [
    { name: 'Dashboard', href: '/dashboard/hotel', icon: LayoutDashboard },
    { name: 'Submit Product', href: '/dashboard/hotel/submit', icon: PackagePlus },
    { name: 'My Products', href: '/dashboard/hotel/products', icon: PackageSearch },
    { name: 'Notifications', href: '/dashboard/hotel/notifications', icon: Bell },
  ]

  const officerLinks = [
    { name: 'Dashboard', href: '/dashboard/officer', icon: LayoutDashboard },
    { name: 'Inspections', href: '/dashboard/officer/inspections', icon: PackageSearch },
    { name: 'Violations', href: '/dashboard/officer/violations', icon: AlertTriangle },
    { name: 'Reports', href: '/dashboard/officer/reports', icon: FileText },
  ]

  const adminLinks = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Hotels', href: '/dashboard/admin/hotels', icon: Building },
    { name: 'Officers', href: '/dashboard/admin/officers', icon: Users },
    { name: 'Violations', href: '/dashboard/admin/violations', icon: AlertTriangle },
  ]

  const links = role === 'HOTEL' ? hotelLinks : role === 'OFFICER' ? officerLinks : adminLinks

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <ShieldCheck className="h-6 w-6 text-emerald-500 mr-2" />
        <span className="text-xl font-bold text-white tracking-tight">Food<span className="text-emerald-500">Guard</span></span>
      </div>
      
      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-3 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== `/dashboard/${role.toLowerCase()}`)
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-emerald-600/10 text-emerald-400' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <link.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
