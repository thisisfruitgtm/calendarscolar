'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSettings } from '@/app/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface SettingsFormProps {
  settings: {
    id: string
    adsEnabled: boolean
    calendarName: string
    showCalendarDayNumbers?: boolean
  } | null
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter()
  const [adsEnabled, setAdsEnabled] = useState(settings?.adsEnabled ?? true)
  const [calendarName, setCalendarName] = useState(
    settings?.calendarName || 'Calendar Școlar 2025-2026'
  )
  const [showCalendarDayNumbers, setShowCalendarDayNumbers] = useState(
    settings?.showCalendarDayNumbers ?? false
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateSettings({
        adsEnabled,
        calendarName,
        showCalendarDayNumbers,
      })
      router.refresh()
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="calendarName">Nume Calendar</Label>
        <Input
          id="calendarName"
          value={calendarName}
          onChange={(e) => setCalendarName(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="adsEnabled"
          checked={adsEnabled}
          onCheckedChange={(checked) => setAdsEnabled(checked === true)}
        />
        <Label htmlFor="adsEnabled" className="cursor-pointer">
          Activează reclamele în calendarul gratuit
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="showCalendarDayNumbers"
          checked={showCalendarDayNumbers}
          onCheckedChange={(checked) => setShowCalendarDayNumbers(checked === true)}
        />
        <Label htmlFor="showCalendarDayNumbers" className="cursor-pointer">
          Afișează ziua din calendar și numele zilei în loc de iconiță
        </Label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Se salvează...' : 'Salvează Setări'}
      </Button>
    </form>
  )
}

