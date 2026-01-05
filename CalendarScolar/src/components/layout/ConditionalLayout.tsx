'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { AccessibilityMenu } from '@/components/accessibility/AccessibilityMenu'
import Link from 'next/link'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't show header and footer in admin sections
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/admin-login')
  
  if (isAdminRoute) {
    return (
      <>
        <Link href="#main-content" className="skip-link">
          Sari la conținut
        </Link>
        {children}
      </>
    )
  }
  
  return (
    <>
      <a href="#main-content" className="skip-link">
        Sari la conținut
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  )
}






