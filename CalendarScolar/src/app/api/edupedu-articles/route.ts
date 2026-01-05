import { NextResponse } from 'next/server'

interface EdupeduArticle {
  title: string
  link: string
  pubDate: string
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

export async function GET() {
  try {
    const feedUrl = 'https://www.edupedu.ro/feed/?s=calendar'
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 seconds timeout

    const response = await fetch(feedUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'CalendarScolar.ro/1.0',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return NextResponse.json({ articles: [] })
    }

    const xmlText = await response.text()
    
    if (!xmlText || xmlText.length < 100) {
      return NextResponse.json({ articles: [] })
    }

    const articles = parseRSSFeed(xmlText)

    // Return latest 3 articles
    return NextResponse.json({ articles: articles.slice(0, 3) })
  } catch (error) {
    // Return empty array on error
    return NextResponse.json({ articles: [] })
  }
}




