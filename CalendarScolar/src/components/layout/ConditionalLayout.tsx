'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't show header and footer in admin sections
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/admin-login')
  
  if (isAdminRoute) {
    return <>{children}</>
  }
  
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}




