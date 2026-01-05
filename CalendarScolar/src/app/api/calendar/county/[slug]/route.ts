import { NextResponse } from 'next/server'
import { getCachedCountyMinimal, getCachedActiveEvents, getCachedActivePromos } from '@/lib/cache'
import { db } from '@/lib/db'
import { generateICS } from '@/lib/ics-generator'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { trackPromoImpression } from '@/app/actions/promos'
import { log } from '@/lib/logger'

type PromoWithCounties = Awaited<ReturnType<typeof getCachedActivePromos>>[0]

function getUserAgentType(userAgent: string | null): string | null {
  if (!userAgent) return null
  
  const ua = userAgent.toLowerCase()
  if (ua.includes('googlecalendar') || ua.includes('google-calendar')) return 'Google Calendar'
  if (ua.includes('calendaragent') || ua.includes('calendar/')) return 'Apple Calendar'
  if (ua.includes('outlook') || ua.includes('microsoft')) return 'Outlook'
  if (ua.includes('thunderbird')) return 'Thunderbird'
  if (ua.includes('caldav') || ua.includes('caldav')) return 'CalDAV Client'
  
  return 'Other'
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  
  try {
    // Rate limiting: 60 requests per minute per IP
    const identifier = getClientIdentifier(request)
    const limit = rateLimit(identifier, 60, 60000)
    
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
            'Content-Type': 'text/calendar; charset=utf-8',
          },
        }
      )
    }
    
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug) || slug.length > 100) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }
    
    // Verify county exists (cached)
    const county = await getCachedCountyMinimal(slug)

    if (!county || !county.active) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      )
    }

    // Track subscription access
    const userAgent = request.headers.get('user-agent')
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    const userAgentType = getUserAgentType(userAgent)
    
    try {
      await db.calendarSubscription.upsert({
        where: {
          countyId_userAgent: {
            countyId: county.id,
            userAgent: userAgentType ?? '',
          },
        },
        create: {
          countyId: county.id,
          userAgent: userAgentType ?? '',
          ipAddress: ipAddress.length > 50 ? 'unknown' : ipAddress,
          accessCount: 1,
        },
        update: {
          accessCount: { increment: 1 },
          lastAccess: new Date(),
        },
      })
    } catch (error) {
      console.error('Error tracking subscription:', error)
    }

    // Get all active events (cached)
    const allEvents = await getCachedActiveEvents()
    
    // Get all active promos (cached)
    const allPromos = await getCachedActivePromos()

    // Filter promos for this county
    const countyPromos: PromoWithCounties[] = allPromos.filter((promo: PromoWithCounties) => {
      // If promo has no counties, it's for all counties
      if (promo.counties.length === 0) return true
      // Check if this county is in the promo's list
      return promo.counties.some((pc: { countyId: string }) => pc.countyId === county.id)
    })

    // Track impressions for promos that will be included in ICS
    // Do this asynchronously to not block ICS generation
    countyPromos
      .filter((p) => p.showOnCalendar)
      .forEach((promo) => {
        trackPromoImpression(promo.id).catch(() => {
          // Silently fail - don't break ICS generation
        })
      })

    // Convert dates
    const events = allEvents.map(({ counties, ...event }) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : null,
    }))

    const promos = countyPromos.map(({ counties, ...promo }) => ({
      ...promo,
      startDate: new Date(promo.startDate),
      endDate: new Date(promo.endDate),
    }))

    // Generate ICS with county name in calendar name
    const calendarName = `Calendar Școlar - ${county.name}`
    const ics = generateICS(events, promos, calendarName)

    return new NextResponse(ics, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Max-Age': '86400',
      },
    })
  } catch (error) {
    log.error('Error generating county ICS', {
      slug,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: 'Failed to generate calendar' },
      { status: 500 }
    )
  }
}
