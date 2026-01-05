import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Don't protect admin-login route
  if (pathname === '/admin-login') {
    const response = NextResponse.next()
    response.headers.set('x-pathname', pathname)
    return response
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
  
  // Pass pathname to server components for maintenance check
  response.headers.set('x-pathname', pathname)
  
  // Security headers are added in next.config.ts, but we can add additional ones here if needed
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
