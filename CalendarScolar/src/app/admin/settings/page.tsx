import { db } from '@/lib/db'
import { SettingsForm } from '@/components/admin/SettingsForm'

export default async function SettingsPage() {
  const settings = await db.settings.findUnique({
    where: { id: 'settings' },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Setări</h1>
        <p className="mt-2 text-slate-600">Configurează setările calendarului</p>
      </div>

      <div className="rounded-md border bg-white p-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  )
}







