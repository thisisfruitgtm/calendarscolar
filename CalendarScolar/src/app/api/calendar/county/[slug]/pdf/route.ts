import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { getCachedCountyBySlug, getCachedActiveEvents } from '@/lib/cache'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { CalendarPDFDocument } from '@/lib/pdf/CalendarPDFDocument'
import { PDFEvent } from '@/lib/pdf/calendar-utils'
import { log } from '@/lib/logger'
import { createHash } from 'crypto'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const SCHOOL_YEAR = '2026-2027'

// PDF cache directory: /data/pdf-cache in production, .cache/pdf in development
const PDF_CACHE_DIR = process.env.NODE_ENV === 'production'
  ? '/data/pdf-cache'
  : join(process.cwd(), '.cache', 'pdf')

// Vacation group badge colors
const GROUP_COLORS: Record<string, string> = {
  'Grupa A': '#1D4ED8', // blue-700
  'Grupa B': '#7C3AED', // violet-600
  'Grupa C': '#059669', // emerald-600
}

/**
 * Build a short hash from the events data so we can detect changes.
 * When events are updated (admin edits, migration), the hash changes
 * and the next request regenerates the PDF.
 */
function buildDataHash(events: PDFEvent[], groupName: string | null): string {
  const payload = JSON.stringify({
    events: events.map(e => ({
      id: e.id,
      start: e.startDate.toISOString(),
      end: e.endDate?.toISOString() ?? null,
      type: e.type,
    })),
    group: groupName,
  })
  return createHash('md5').update(payload).digest('hex').slice(0, 12)
}

async function ensureCacheDir() {
  if (!existsSync(PDF_CACHE_DIR)) {
    await mkdir(PDF_CACHE_DIR, { recursive: true })
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    // Rate limiting: 30 requests per minute per IP (heavier than ICS)
    const identifier = getClientIdentifier(request)
    const limit = rateLimit(`pdf:${identifier}`, 30, 60000)

    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
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

    // Get county with group and vacation periods
    const county = await getCachedCountyBySlug(slug)

    if (!county || !county.active) {
      return NextResponse.json(
        { error: 'County not found' },
        { status: 404 }
      )
    }

    // Get all active events
    const allEvents = await getCachedActiveEvents()

    // Filter events relevant to this county:
    // - Events with no county associations (national events)
    // - Events specifically for this county
    const countyEvents: PDFEvent[] = allEvents
      .filter((event) => {
        if (event.counties.length === 0) return true
        return event.counties.some((ec) => ec.countyId === county.id)
      })
      .map((event) => ({
        id: event.id,
        startDate: new Date(event.startDate),
        endDate: event.endDate ? new Date(event.endDate) : null,
        type: event.type,
        title: event.title,
      }))

    // Add vacation periods from county's group
    if (county.group?.periods) {
      for (const period of county.group.periods) {
        countyEvents.push({
          id: period.id,
          startDate: new Date(period.startDate),
          endDate: new Date(period.endDate),
          type: 'VACATION',
          title: period.name,
        })
      }
    }

    const groupName = county.group?.name ?? null
    const groupColor = groupName ? (GROUP_COLORS[groupName] ?? '#64748B') : '#64748B'

    // --- File-system PDF cache ---
    const dataHash = buildDataHash(countyEvents, groupName)
    const cacheFileName = `calendar-${slug}-${dataHash}.pdf`
    const cachePath = join(PDF_CACHE_DIR, cacheFileName)

    let pdfBuffer: Buffer

    if (existsSync(cachePath)) {
      // Cache HIT — serve from disk
      pdfBuffer = await readFile(cachePath)
    } else {
      // Cache MISS — generate and save
      pdfBuffer = Buffer.from(await renderToBuffer(
        CalendarPDFDocument({
          countyName: county.name,
          groupName,
          groupColor,
          schoolYear: SCHOOL_YEAR,
          events: countyEvents,
        })
      ))

      // Save to cache (non-blocking, don't fail the request)
      ensureCacheDir()
        .then(() => writeFile(cachePath, pdfBuffer))
        .catch((err) => log.error('Failed to cache PDF', { slug, error: String(err) }))
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="calendar-scolar-${slug}-${SCHOOL_YEAR}.pdf"`,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch (error) {
    log.error('Error generating county PDF', {
      slug,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
