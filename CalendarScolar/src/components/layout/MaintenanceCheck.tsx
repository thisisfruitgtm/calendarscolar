import { db } from '@/lib/db'
import { MaintenanceGate } from './MaintenanceGate'

async function getMaintenanceStatus() {
  const settings = await db.settings.findUnique({
    where: { id: 'settings' },
    select: { maintenanceMode: true, maintenanceMessage: true }
  })
  return settings
}

export async function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const settings = await getMaintenanceStatus()

  // If maintenance mode is off, render children normally
  if (!settings?.maintenanceMode) {
    return <>{children}</>
  }

  // Delegate to client component for pathname-based admin bypass
  return (
    <MaintenanceGate message={settings.maintenanceMessage}>
      {children}
    </MaintenanceGate>
  )
}
