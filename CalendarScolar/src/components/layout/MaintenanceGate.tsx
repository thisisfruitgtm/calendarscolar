'use client'

import { usePathname } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'

export function MaintenanceGate({
  children,
  message
}: {
  children: React.ReactNode
  message: string | null
}) {
  const pathname = usePathname()

  // Skip maintenance for admin routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/auth-cs7k9')) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="max-w-lg mx-auto p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mb-6">
          <AlertTriangle className="w-10 h-10 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Site în mentenanță
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          {message || 'Revenim în curând cu îmbunătățiri. Mulțumim pentru răbdare!'}
        </p>
        <div className="text-sm text-gray-500">
          CalendarȘcolar.ro
        </div>
      </div>
    </div>
  )
}
