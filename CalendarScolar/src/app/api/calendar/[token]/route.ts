import { NextResponse } from 'next/server'
import { getCachedActiveEvents } from '@/lib/cache'
import { generateICS } from '@/lib/ics-generator'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    
    // TODO: Validate token against premium users table
    // For now, any token means premium (no ads)
    
    const allEvents = await getCachedActiveEvents()

    // Remove counties field and convert dates back to Date objects (cache serializes them as strings)
    const events = allEvents.map(({ counties, ...event }) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : null,
    }))
    
    // Generate ICS without ads
    const ics = generateICS(events, { includeAds: false, token })

    return new NextResponse(ics, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="calendar-scolar-premium.ics"',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating premium ICS:', error)
    return NextResponse.json(
      { error: 'Failed to generate calendar' },
      { status: 500 }
    )
  }
}


