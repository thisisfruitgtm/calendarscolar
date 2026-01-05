import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Don't protect admin-login route
  if (pathname === '/admin-login') {
    return NextResponse.next()
  }
  
  // Check auth for admin routes
  if (pathname.startsWith('/admin')) {
    const session = await auth()
    
    if (!session) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
  }
  
  // Add security headers
  const response = NextResponse.next()
  
  // Security headers are added in next.config.ts, but we can add additional ones here if needed
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  return response
}

export const config = {
  matcher: ['/admin/:path*', '/admin-login'],
}
