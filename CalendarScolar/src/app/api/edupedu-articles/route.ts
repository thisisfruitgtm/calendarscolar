import { NextResponse } from 'next/server'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { getCachedSettings } from '@/lib/cache'

interface EdupeduArticle {
  title: string
  link: string
  pubDate: string
}

// In-memory cache for articles (since feed is >2MB and can't use Next.js cache)
let articlesCache: {
  articles: EdupeduArticle[]
  timestamp: number
} | null = null

const CACHE_DURATION = 3600000 // 1 hour in milliseconds

/**
 * Clear the articles cache (called from admin settings)
 */
export function clearEdupeduCache() {
  articlesCache = null
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

function parseRSSFeed(xmlText: string): EdupeduArticle[] {
  const articles: EdupeduArticle[] = []
  
  // Extract all <item> blocks (non-greedy match)
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let match
  const items: string[] = []
  
  while ((match = itemRegex.exec(xmlText)) !== null) {
    items.push(match[1])
  }

  for (const item of items) {
    // Extract title - handle both CDATA and regular format
    let title = ''
    const titleCdataMatch = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)
    if (titleCdataMatch) {
      title = titleCdataMatch[1].trim()
    } else {
      const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/i)
      if (titleMatch) {
        title = titleMatch[1].trim()
      }
    }
    
    // Extract link
    const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/i)
    const link = linkMatch ? linkMatch[1].trim() : ''
    
    // Extract pubDate
    const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : ''
    
    // Extract description for filtering
    let description = ''
    const descCdataMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i)
    if (descCdataMatch) {
      description = descCdataMatch[1].toLowerCase()
    } else {
      const descMatch = item.match(/<description>([\s\S]*?)<\/description>/i)
      if (descMatch) {
        description = descMatch[1].toLowerCase()
      }
    }
    
    // Filter articles that contain "calendar" (case insensitive)
    const titleLower = title.toLowerCase()
    const hasCalendar = titleLower.includes('calendar') || description.includes('calendar')
    
    if (hasCalendar && title && link) {
      articles.push({
        title: decodeHtmlEntities(title),
        link: decodeHtmlEntities(link),
        pubDate,
      })
    }
  }

  return articles
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const forceRefresh = url.searchParams.get('refresh') === 'true'
  
  // Rate limiting: 30 requests per minute per IP
  const identifier = getClientIdentifier(request)
  const limit = rateLimit(identifier, 30, 60000)
  
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  // Check if Edupedu is enabled in settings
  const settings = await getCachedSettings()
  if (settings && settings.edupeduEnabled === false) {
    return NextResponse.json(
      { articles: [], disabled: true },
      { headers: { 'Cache-Control': 'public, max-age=60' } }
    )
  }

  // Clear cache if force refresh requested
  if (forceRefresh) {
    articlesCache = null
  }

  // Check if we have valid cached articles
  const now = Date.now()
  if (articlesCache && (now - articlesCache.timestamp) < CACHE_DURATION) {
    return NextResponse.json(
      { articles: articlesCache.articles, cached: true },
      { 
        headers: { 
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' 
        } 
      }
    )
  }

  try {
    const feedUrl = 'https://www.edupedu.ro/feed/?s=calendar'
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    // Don't use Next.js cache - feed is too large (>2MB)
    // Using in-memory cache instead
    const response = await fetch(feedUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'CalendarScolar.ro/1.0',
      },
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      // Return cached articles if available, otherwise empty
      if (articlesCache) {
        return NextResponse.json(
          { articles: articlesCache.articles, stale: true },
          { headers: { 'Cache-Control': 'public, max-age=300' } }
        )
      }
      return NextResponse.json(
        { articles: [] },
        { headers: { 'Cache-Control': 'public, max-age=300' } }
      )
    }

    const xmlText = await response.text()
    
    if (!xmlText || xmlText.length < 100) {
      return NextResponse.json(
        { articles: [] },
        { headers: { 'Cache-Control': 'public, max-age=300' } }
      )
    }

    const articles = parseRSSFeed(xmlText).slice(0, 3)
    
    // Update cache
    articlesCache = {
      articles,
      timestamp: now,
    }

    // Return latest 3 articles with caching headers
    return NextResponse.json(
      { articles },
      { 
        headers: { 
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' 
        } 
      }
    )
  } catch {
    // Return cached articles if available, otherwise empty
    if (articlesCache) {
      return NextResponse.json(
        { articles: articlesCache.articles, stale: true },
        { headers: { 'Cache-Control': 'public, max-age=300' } }
      )
    }
    return NextResponse.json(
      { articles: [] },
      { headers: { 'Cache-Control': 'public, max-age=300' } }
    )
  }
}




