'use client'

import { useState, useEffect } from 'react'
import { Share2, Check, CalendarPlus, Copy } from 'lucide-react'
import { SiApple } from 'react-icons/si'
import { GoogleCalendarIcon } from '@/components/icons/GoogleCalendarIcon'
import { OutlookIcon } from '@/components/icons/OutlookIcon'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Event } from '@prisma/client'

interface CountyActionsProps {
  county: {
    id: string
    name: string
    slug: string
  }
  events: Event[]
}

export function CountyActions({ county, events }: CountyActionsProps) {
  const [copied, setCopied] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [baseUrl, setBaseUrl] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isScrolledPastHeader, setIsScrolledPastHeader] = useState(false)

  useEffect(() => {
    // Use NEXT_PUBLIC_APP_URL if set (for tunneling), otherwise use current origin
    const publicUrl = process.env.NEXT_PUBLIC_APP_URL
    const url = publicUrl || window.location.origin
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Legitimate hydration pattern
    setBaseUrl(url)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      // Header is typically around 80-100px, we'll use 100px as threshold
      const scrollY = window.scrollY || window.pageYOffset
      setIsScrolledPastHeader(scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [mounted])

  const calendarFeedUrl = baseUrl ? `${baseUrl}/api/calendar/county/${county.slug}` : ''
  const googleCalendarUrl = calendarFeedUrl ? `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(calendarFeedUrl)}` : '#'
  // Apple Calendar requires webcal:// protocol, even for HTTPS URLs
  // webcal:// will be converted to https:// by Apple Calendar automatically
  const appleCalendarUrl = calendarFeedUrl 
    ? `webcal://${calendarFeedUrl.replace('https://', '').replace('http://', '')}`
    : '#'
  const outlookCalendarUrl = calendarFeedUrl ? `https://outlook.live.com/calendar/0/addcalendar?url=${encodeURIComponent(calendarFeedUrl)}` : '#'

  const copyToClipboard = (text: string): boolean => {
    try {
      // Use execCommand which works in event handler context
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      return successful
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      return false
    }
  }

  const handleShare = async () => {
    if (!baseUrl) return
    
    const url = `${baseUrl}/judet/${county.slug}`
    const title = `Calendar Școlar ${county.name} 2025-2026`
    const text = `Vezi calendarul școlar complet pentru ${county.name}`

    try {
      if (navigator.share) {
        // Native share API (mobile)
        await navigator.share({
          title,
          text,
          url,
        })
        return
      }
    } catch (error) {
      // User cancelled share or error, continue to clipboard fallback
    }

    // Fallback: copy to clipboard using execCommand (works in event handler context)
    const success = copyToClipboard(url)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const trackAction = async (actionType: string) => {
    try {
      await fetch('/api/track-subscription-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countyId: county.id,
          actionType,
        }),
      })
    } catch (error) {
      // Silently fail tracking
      console.error('Error tracking action:', error)
    }
  }

  const handleCopyFeedUrl = () => {
    if (!calendarFeedUrl) return
    
    const success = copyToClipboard(calendarFeedUrl)
    if (success) {
      trackAction('copy_url')
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setDialogOpen(false)
      }, 1500)
    }
  }

  const handleGoogleCalendarClick = () => {
    trackAction('google')
  }

  const handleAppleCalendarClick = () => {
    trackAction('apple')
  }

  const handleOutlookClick = () => {
    trackAction('outlook')
  }

  return (
    <div className={`flex gap-3 w-full md:max-w-md md:mx-auto md:relative md:bg-transparent md:backdrop-blur-none md:border-t-0 md:shadow-none md:p-0 transition-all duration-300 ease-in-out ${
      isScrolledPastHeader 
        ? 'fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200/50 shadow-lg' 
        : ''
    }`}>
      {mounted ? (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="group flex flex-1 items-center justify-center gap-3 rounded-xl bg-primary hover:bg-primary/90 px-6 py-6 text-white shadow-md transition-all hover:shadow-lg">
              <CalendarPlus className="h-5 w-5 shrink-0 text-white" />
              <span className="font-semibold text-center">Adaugă în calendar</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adaugă în calendar</DialogTitle>
            <DialogDescription>
              Alege aplicația ta preferată pentru a adăuga calendarul școlar
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleGoogleCalendarClick}
              className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                <GoogleCalendarIcon className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">Google Calendar</div>
                <div className="text-sm text-slate-500">Pentru utilizatorii Google</div>
              </div>
            </a>

            <a
              href={appleCalendarUrl}
              onClick={handleAppleCalendarClick}
              className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                <SiApple className="h-8 w-8 text-slate-900" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">Apple Calendar</div>
                <div className="text-sm text-slate-500">
                  {baseUrl.includes('localhost') 
                    ? '⚠️ Necesită URL public (nu funcționează pe localhost)'
                    : 'Pentru iPhone și Mac'}
                </div>
              </div>
            </a>

            <a
              href={outlookCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOutlookClick}
              className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                <OutlookIcon className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">Outlook</div>
                <div className="text-sm text-slate-500">Pentru Microsoft 365</div>
              </div>
            </a>

            <button
              onClick={handleCopyFeedUrl}
              className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50 text-left w-full"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                {copied ? (
                  <Check className="h-6 w-6 text-green-600" />
                ) : (
                  <Copy className="h-6 w-6 text-slate-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">
                  {copied ? 'URL copiat!' : 'Copiază URL Feed'}
                </div>
                <div className="text-sm text-slate-500">
                  Pentru alte aplicații de calendar
                </div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
      ) : (
        <Button className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-white px-6 py-6 text-slate-400 shadow-md border border-slate-200/50" disabled>
          <CalendarPlus className="h-5 w-5 shrink-0 text-slate-300" />
          <span className="font-semibold text-center">Adaugă în calendar</span>
        </Button>
      )}
      
      <Button
        onClick={handleShare}
        className="group flex flex-1 items-center justify-center gap-3 rounded-xl bg-white hover:bg-slate-50 px-6 py-6 text-slate-700 shadow-sm transition-all hover:shadow-md"
      >
        {copied ? (
          <Check className="h-5 w-5 shrink-0 text-green-600" />
        ) : (
          <Share2 className="h-5 w-5 shrink-0 text-slate-700" />
        )}
        <span className="font-semibold text-center">
          {copied ? 'Link copiat!' : 'Distribuie'}
        </span>
      </Button>
    </div>
  )
}

