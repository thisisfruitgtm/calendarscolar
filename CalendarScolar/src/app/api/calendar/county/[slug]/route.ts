import { NextResponse } from 'next/server'
import { getCachedCountyMinimal, getCachedActiveEvents, getCachedSettings } from '@/lib/cache'
import { db } from '@/lib/db'
import { generateICS } from '@/lib/ics-generator'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'

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
  try {
    // Rate limiting: 60 requests per minute per IP (calendar apps poll frequently)
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
    
    const { slug } = await params
    
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
    
    // Track subscription access
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
      // Silently fail tracking - don't break calendar feed
      console.error('Error tracking subscription:', error)
    }

    // Get settings (cached)
    const settings = await getCachedSettings()

    // Get all active events with their county associations (cached)
    const allEvents = await getCachedActiveEvents()

    // Filter events based on county:
    // - Non-ad events: include all
    // - Ad events with no counties: include all (for all counties)
    // - Ad events with counties: include only if this county is in the list
    const filteredEvents = allEvents.filter((event) => {
      if (!event.isAd) {
        return true // Include all non-ad events
      }
      
      // If ad has no counties associated, it's for all counties
      if (event.counties.length === 0) {
        return true
      }
      
      // Check if this county is in the ad's county list
      return event.counties.some(ec => ec.countyId === county.id)
    })

    // Convert dates back to Date objects (cache serializes them as strings)
    const events = filteredEvents.map(({ counties, ...event }) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : null,
    }))

    // Generate ICS
    const includeAds = settings?.adsEnabled ?? true
    const ics = generateICS(events, { includeAds })

    // Return as calendar feed (not attachment) for subscription
    return new NextResponse(ics, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      // CORS for calendar subscriptions (restrictive)
      'Access-Control-Allow-Origin': '*', // Calendar apps need this
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Max-Age': '86400', // 24 hours
      },
    })
  } catch (error) {
    console.error('Error generating county ICS:', error)
    return NextResponse.json(
      { error: 'Failed to generate calendar' },
      { status: 500 }
    )
  }
}

