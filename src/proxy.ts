import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt, updateSession } from './lib/auth'

export async function proxy(request: NextRequest) {
  // Update session expiration if present
  const response = await updateSession(request)

  const sessionCookie = request.cookies.get('session')?.value
  
  // Define protected routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isHotelRoute = request.nextUrl.pathname.startsWith('/dashboard/hotel')
  const isOfficerRoute = request.nextUrl.pathname.startsWith('/dashboard/officer')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/dashboard/admin')

  if (isProtectedRoute) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const session = await decrypt(sessionCookie)
      
      if (isHotelRoute && session.role !== 'HOTEL') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      
      if (isOfficerRoute && session.role !== 'OFFICER') {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      if (isAdminRoute && session.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect authenticated users away from login/register pages
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'
  if (isAuthPage && sessionCookie) {
    try {
      const session = await decrypt(sessionCookie)
      if (session.role === 'HOTEL') return NextResponse.redirect(new URL('/dashboard/hotel', request.url))
      if (session.role === 'OFFICER') return NextResponse.redirect(new URL('/dashboard/officer', request.url))
      if (session.role === 'ADMIN') return NextResponse.redirect(new URL('/dashboard/admin', request.url))
    } catch (error) {}
  }

  return response || NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
