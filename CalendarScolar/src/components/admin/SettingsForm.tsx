'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSettings, invalidateAllCaches, refreshEdupeduCache } from '@/app/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Trash2, AlertTriangle, Newspaper, Settings, Calendar } from 'lucide-react'

interface SettingsFormProps {
  settings: {
    id: string
    adsEnabled: boolean
    calendarName: string
    schoolYear: string
    showCalendarDayNumbers?: boolean
    edupeduEnabled?: boolean
    edupeduLastRefresh?: Date | null
    maintenanceMode?: boolean
    maintenanceMessage?: string | null
    lastCacheInvalidation?: Date | null
  } | null
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter()
  
  // Form state
  const [adsEnabled, setAdsEnabled] = useState(settings?.adsEnabled ?? true)
  const [calendarName, setCalendarName] = useState(settings?.calendarName || 'Calendar Școlar 2025-2026')
  const [schoolYear, setSchoolYear] = useState(settings?.schoolYear || '2025-2026')
  const [showCalendarDayNumbers, setShowCalendarDayNumbers] = useState(settings?.showCalendarDayNumbers ?? false)
  const [edupeduEnabled, setEdupeduEnabled] = useState(settings?.edupeduEnabled ?? true)
  const [maintenanceMode, setMaintenanceMode] = useState(settings?.maintenanceMode ?? false)
  const [maintenanceMessage, setMaintenanceMessage] = useState(settings?.maintenanceMessage || '')
  
  // Loading states
  const [loading, setLoading] = useState(false)
  const [refreshingCache, setRefreshingCache] = useState(false)
  const [refreshingEdupedu, setRefreshingEdupedu] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateSettings({
        adsEnabled,
        calendarName,
        schoolYear,
        showCalendarDayNumbers,
        edupeduEnabled,
        maintenanceMode,
        maintenanceMessage: maintenanceMessage || undefined,
      })
      router.refresh()
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInvalidateCache = async () => {
    setRefreshingCache(true)
    try {
      await invalidateAllCaches()
      router.refresh()
    } catch (error) {
      console.error('Error invalidating cache:', error)
    } finally {
      setRefreshingCache(false)
    }
  }

  const handleRefreshEdupedu = async () => {
    setRefreshingEdupedu(true)
    try {
      await refreshEdupeduCache()
      router.refresh()
    } catch (error) {
      console.error('Error refreshing Edupedu:', error)
    } finally {
      setRefreshingEdupedu(false)
    }
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Niciodată'
    return new Intl.DateTimeFormat('ro-RO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  return (
    <div className="space-y-6">
      {/* Main Settings Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Calendar Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendar
              </CardTitle>
              <CardDescription>Setări generale pentru calendar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="calendarName">Nume Calendar</Label>
                <Input
                  id="calendarName"
                  value={calendarName}
                  onChange={(e) => setCalendarName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolYear">An Școlar</Label>
                <Input
                  id="schoolYear"
                  value={schoolYear}
                  onChange={(e) => setSchoolYear(e.target.value)}
                  placeholder="2025-2026"
                />
                <p className="text-xs text-slate-500">Format: YYYY-YYYY (ex: 2025-2026)</p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showCalendarDayNumbers"
                  checked={showCalendarDayNumbers}
                  onCheckedChange={(checked) => setShowCalendarDayNumbers(checked === true)}
                />
                <Label htmlFor="showCalendarDayNumbers" className="cursor-pointer">
                  Afișează ziua din calendar în loc de iconiță
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="adsEnabled"
                  checked={adsEnabled}
                  onCheckedChange={(checked) => setAdsEnabled(checked === true)}
                />
                <Label htmlFor="adsEnabled" className="cursor-pointer">
                  Activează promoțiile în calendar
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Edupedu Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                Edupedu.ro
              </CardTitle>
              <CardDescription>Integrare cu știrile de pe Edupedu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edupeduEnabled"
                  checked={edupeduEnabled}
                  onCheckedChange={(checked) => setEdupeduEnabled(checked === true)}
                />
                <Label htmlFor="edupeduEnabled" className="cursor-pointer">
                  Afișează articole Edupedu în footer
                </Label>
              </div>

              <div className="rounded-md bg-slate-50 p-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Ultima actualizare:</span>
                  <span className="font-medium">{formatDate(settings?.edupeduLastRefresh)}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Cache-ul se actualizează automat la fiecare oră
                </p>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                onClick={handleRefreshEdupedu}
                disabled={refreshingEdupedu}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshingEdupedu ? 'animate-spin' : ''}`} />
                {refreshingEdupedu ? 'Se actualizează...' : 'Actualizează Articole'}
              </Button>
            </CardContent>
          </Card>

          {/* Maintenance Mode */}
          <Card className={maintenanceMode ? 'border-orange-300 bg-orange-50' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className={`h-5 w-5 ${maintenanceMode ? 'text-orange-600' : ''}`} />
                Mentenanță
              </CardTitle>
              <CardDescription>
                Activează modul de mentenanță pentru a afișa un mesaj utilizatorilor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="maintenanceMode"
                  checked={maintenanceMode}
                  onCheckedChange={(checked) => setMaintenanceMode(checked === true)}
                />
                <Label htmlFor="maintenanceMode" className="cursor-pointer font-medium">
                  Activează modul de mentenanță
                </Label>
              </div>

              {maintenanceMode && (
                <div className="space-y-2">
                  <Label htmlFor="maintenanceMessage">Mesaj Mentenanță</Label>
                  <Textarea
                    id="maintenanceMessage"
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    placeholder="Site-ul este în mentenanță. Revenim în curând!"
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cache Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cache & Performanță
              </CardTitle>
              <CardDescription>Gestionează cache-ul aplicației</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-slate-50 p-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Ultima invalidare cache:</span>
                  <span className="font-medium">{formatDate(settings?.lastCacheInvalidation)}</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                onClick={handleInvalidateCache}
                disabled={refreshingCache}
                className="w-full"
              >
                <Trash2 className={`h-4 w-4 mr-2 ${refreshingCache ? 'animate-spin' : ''}`} />
                {refreshingCache ? 'Se invalidează...' : 'Invalidează Tot Cache-ul'}
              </Button>

              <p className="text-xs text-slate-500">
                Folosește această opțiune după modificări în masă pentru a forța reîncărcarea datelor.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? 'Se salvează...' : 'Salvează Setări'}
          </Button>
        </div>
      </form>
    </div>
  )
}
