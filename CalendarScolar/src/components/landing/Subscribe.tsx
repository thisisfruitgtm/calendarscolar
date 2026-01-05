import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GoogleCalendarIcon } from '@/components/icons/GoogleCalendarIcon'
import { OutlookIcon } from '@/components/icons/OutlookIcon'
import { SiApple } from 'react-icons/si'
import Link from 'next/link'

export function Subscribe() {
  const calendarUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/calendar`
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(calendarUrl)}`
  // Apple Calendar requires webcal:// protocol, even for HTTPS URLs
  // webcal:// will be converted to https:// by Apple Calendar automatically
  const appleCalendarUrl = `webcal://${calendarUrl.replace('https://', '').replace('http://', '')}`
  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/addcalendar?url=${encodeURIComponent(calendarUrl)}`

  return (
    <section className="bg-blue-600 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Abonează-te acum
          </h2>
          <p className="mt-6 text-lg leading-8 text-blue-100">
            Alege aplicația ta preferată și adaugă calendarul în câteva click-uri.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm mb-4 mx-auto">
                  <GoogleCalendarIcon className="h-8 w-8" />
                </div>
                <CardTitle>Google Calendar</CardTitle>
                <CardDescription>Pentru utilizatorii Google</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" size="lg">
                  <Link href={googleCalendarUrl} target="_blank">
                    Adaugă
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm mb-4 mx-auto">
                  <SiApple className="h-8 w-8 text-slate-900" />
                </div>
                <CardTitle>Apple Calendar</CardTitle>
                <CardDescription>Pentru iPhone și Mac</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline" size="lg">
                  <Link href={appleCalendarUrl}>
                    Adaugă
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm mb-4 mx-auto">
                  <OutlookIcon className="h-8 w-8" />
                </div>
                <CardTitle>Outlook</CardTitle>
                <CardDescription>Pentru Microsoft 365</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline" size="lg">
                  <Link href={outlookCalendarUrl} target="_blank">
                    Adaugă
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

