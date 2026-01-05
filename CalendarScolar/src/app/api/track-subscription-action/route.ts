import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'

export async function POST(request: Request) {
  // Rate limiting: 20 requests per minute per IP
  const identifier = getClientIdentifier(request)
  const limit = rateLimit(identifier, 20, 60000)
  
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      }
    )
  }
  try {
    const { countyId, actionType } = await request.json()

    // Validate input
    if (!countyId || !actionType) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    // Validate countyId format
    if (!/^c[a-z0-9]{24}$/.test(countyId)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    // Validate actionType
    const validActionTypes = ['google', 'apple', 'outlook', 'copy_url']
    if (!validActionTypes.includes(actionType)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    const userAgent = request.headers.get('user-agent')
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Sanitize and limit userAgent length
    const sanitizedUserAgent = userAgent?.substring(0, 500) || null
    const sanitizedIp = ipAddress.length > 50 ? 'unknown' : ipAddress.substring(0, 50)

    await db.subscriptionAction.create({
      data: {
        countyId,
        actionType,
        userAgent: sanitizedUserAgent,
        ipAddress: sanitizedIp,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking subscription action:', error)
    return NextResponse.json(
      { error: 'Operation failed' },
      { status: 500 }
    )
  }
}

