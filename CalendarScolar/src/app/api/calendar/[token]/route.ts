import { NextResponse } from 'next/server'
import { getCachedActiveEvents, getCachedActivePromos } from '@/lib/cache'
import { generateICS } from '@/lib/ics-generator'
import { log } from '@/lib/logger'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    await params // Token validation can be added here later
    
    const allEvents = await getCachedActiveEvents()
    const allPromos = await getCachedActivePromos()

    // Remove counties field and convert dates
    const events = allEvents.map(({ counties, ...event }) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : null,
    }))

    const promos = allPromos.map(({ counties, ...promo }) => ({
      ...promo,
      startDate: new Date(promo.startDate),
      endDate: new Date(promo.endDate),
    }))
    
    // Generate ICS
    const ics = generateICS(events, promos)

    return new NextResponse(ics, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="calendar-scolar-premium.ics"',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    log.error('Error generating premium ICS', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: 'Failed to generate calendar' },
      { status: 500 }
    )
  }
}
