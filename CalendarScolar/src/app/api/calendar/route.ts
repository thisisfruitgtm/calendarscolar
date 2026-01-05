import { NextResponse } from 'next/server'
import { getCachedActiveEvents, getCachedActivePromos } from '@/lib/cache'
import { generateICS } from '@/lib/ics-generator'
import { trackPromoImpression } from '@/app/actions/promos'
import { log } from '@/lib/logger'

export async function GET() {
  try {
    // Get all active events (cached)
    const allEvents = await getCachedActiveEvents()

    // Get all active promos (cached)
    const allPromos = await getCachedActivePromos()

    // Remove counties field and convert dates back to Date objects
    const events = allEvents.map(({ counties, ...event }) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : null,
    }))

    // Remove counties field from promos
    const promos = allPromos.map(({ counties, ...promo }) => ({
      ...promo,
      startDate: new Date(promo.startDate),
      endDate: new Date(promo.endDate),
    }))

    // Track impressions for promos that will be included in ICS
    promos
      .filter(p => p.showOnCalendar)
      .forEach(promo => {
        trackPromoImpression(promo.id).catch(() => {
          // Silently fail - don't break ICS generation
        })
      })
    
    // Generate ICS with events and promos
    const ics = generateICS(events, promos)

    return new NextResponse(ics, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="calendar-scolar.ics"',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    log.error('Error generating ICS', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: 'Failed to generate calendar' },
      { status: 500 }
    )
  }
}
