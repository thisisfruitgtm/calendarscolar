'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GoogleCalendarIcon } from '@/components/icons/GoogleCalendarIcon'
import { OutlookIcon } from '@/components/icons/OutlookIcon'
import { SiApple } from 'react-icons/si'
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import { CountyAutocomplete } from './CountyAutocomplete'

interface SubscribeProps {
  counties?: Array<{ id: string; name: string; slug: string; capitalCity: string }>
}

export function Subscribe({ counties: initialCounties }: SubscribeProps) {
  const [selectedCounty, setSelectedCounty] = useState<{ id: string; name: string; slug: string; capitalCity: string } | null>(null)
  const [showCalendarOptions, setShowCalendarOptions] = useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  const calendarUrl = selectedCounty 
    ? `${baseUrl}/api/calendar/county/${selectedCounty.slug}`
    : `${baseUrl}/api/calendar`
  
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(calendarUrl)}`
  const appleCalendarUrl = `webcal://${calendarUrl.replace('https://', '').replace('http://', '')}`
  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/addcalendar?url=${encodeURIComponent(calendarUrl)}`

  const handleCountySelect = (county: { id: string; name: string; slug: string; capitalCity: string }) => {
    setSelectedCounty(county)
    if (county) {
      setShowCalendarOptions(true)
    }
  }

  return (
    <section className="bg-blue-600 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Adaugă în calendar
          </h2>
          <p className="mt-6 text-lg leading-8 text-blue-100">
            Alege județul tău și aplicația preferată pentru a adăuga calendarul în câteva click-uri.
          </p>

          {/* County Selection */}
          <div className="mt-10">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <label className="text-sm font-semibold text-slate-900">
                  Selectează județul
                </label>
              </div>
              <CountyAutocomplete
                counties={initialCounties || []}
                onSelect={handleCountySelect}
                placeholder="Caută județul tău..."
              />
              {selectedCounty && (
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>Județ selectat: <strong>{selectedCounty.name}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Calendar Options - Show after county selection */}
          {showCalendarOptions && selectedCounty && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-sm text-blue-100 mb-6">
                Alege aplicația ta preferată:
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="border-2 border-blue-500 shadow-xl hover:shadow-2xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm mb-4 mx-auto">
                      <GoogleCalendarIcon className="h-8 w-8" />
                    </div>
                    <CardTitle>Google Calendar</CardTitle>
                    <CardDescription>Pentru utilizatorii Google</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full" size="lg" variant="default">
                      <Link href={googleCalendarUrl} target="_blank">
                        Adaugă în calendar
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border-2 border-blue-500 shadow-xl hover:shadow-2xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm mb-4 mx-auto">
                      <SiApple className="h-8 w-8 text-slate-900" />
                    </div>
                    <CardTitle>Apple Calendar</CardTitle>
                    <CardDescription>Pentru iPhone și Mac</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full" size="lg" variant="default">
                      <Link href={appleCalendarUrl}>
                        Adaugă în calendar
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border-2 border-blue-500 shadow-xl hover:shadow-2xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm mb-4 mx-auto">
                      <OutlookIcon className="h-8 w-8" />
                    </div>
                    <CardTitle>Outlook</CardTitle>
                    <CardDescription>Pentru Microsoft 365</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full" size="lg" variant="default">
                      <Link href={outlookCalendarUrl} target="_blank">
                        Adaugă în calendar
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              {/* Option to change county */}
              <div className="mt-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedCounty(null)
                    setShowCalendarOptions(false)
                  }}
                  className="text-blue-100 hover:text-white hover:bg-blue-700"
                >
                  Schimbă județul
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
