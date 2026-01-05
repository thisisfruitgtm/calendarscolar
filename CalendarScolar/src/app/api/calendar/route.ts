import { NextResponse } from 'next/server'
import { getCachedSettings, getCachedActiveEvents } from '@/lib/cache'
import { generateICS } from '@/lib/ics-generator'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    // Get settings (cached)
    const settings = await getCachedSettings()

    // Get all active events (cached)
    const allEvents = await getCachedActiveEvents()

    // Remove counties field and convert dates back to Date objects (cache serializes them as strings)
    const events = allEvents.map(({ counties, ...event }) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : null,
    }))
    
    // Generate ICS
    const includeAds = token ? false : (settings?.adsEnabled ?? true)
    const ics = generateICS(events, { includeAds })

    return new NextResponse(ics, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="calendar-scolar.ics"',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating ICS:', error)
    return NextResponse.json(
      { error: 'Failed to generate calendar' },
      { status: 500 }
    )
  }
}


