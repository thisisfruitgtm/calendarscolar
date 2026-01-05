import { db } from '@/lib/db'
import { headers } from 'next/headers'
import { AlertTriangle } from 'lucide-react'

async function getMaintenanceStatus() {
  const settings = await db.settings.findUnique({
    where: { id: 'settings' },
    select: { maintenanceMode: true, maintenanceMessage: true }
  })
  return settings
}

export async function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  
  // Skip maintenance check for admin routes
  if (pathname.startsWith('/admin')) {
    return <>{children}</>
  }
  
  const settings = await getMaintenanceStatus()
  
  // If maintenance mode is off, render children normally
  if (!settings?.maintenanceMode) {
    return <>{children}</>
  }
  
  // Show maintenance page
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
          {settings.maintenanceMessage || 'Revenim în curând cu îmbunătățiri. Mulțumim pentru răbdare!'}
        </p>
        <div className="text-sm text-gray-500">
          CalendarȘcolar.ro
        </div>
      </div>
    </div>
  )
}

