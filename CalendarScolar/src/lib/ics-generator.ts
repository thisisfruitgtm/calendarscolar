import { Event, Promo } from '@prisma/client'
import { sanitizeText } from './sanitize'

interface ICSEvent {
  id: string
  title: string
  description?: string | null
  startDate: Date
  endDate: Date | null
  type?: string
  imageUrl?: string | null
  link?: string | null
}

/**
 * Validate URL to prevent injection attacks
 * Only allows http/https URLs
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

/**
 * Sanitize URL for ICS - removes dangerous protocols and validates format
 */
function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) return null
  
  // Remove any whitespace and control characters
  const cleaned = url.trim().replace(/[\x00-\x1f\x7f]/g, '')
  
  // Validate URL format
  if (!isValidUrl(cleaned)) return null
  
  // Block javascript:, data:, vbscript: protocols (defense in depth)
  const lowerUrl = cleaned.toLowerCase()
  if (lowerUrl.startsWith('javascript:') || 
      lowerUrl.startsWith('data:') || 
      lowerUrl.startsWith('vbscript:')) {
    return null
  }
  
  return cleaned
}

/**
 * Sanitize text for ICS to prevent CRLF injection
 * Removes newlines and other control characters that could break ICS format
 */
function sanitizeICSText(text: string): string {
  if (!text) return ''
  
  // Remove control characters except newlines (which we'll escape)
  return text
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '') // Remove control chars
    .replace(/\r\n/g, '\\n')  // Escape CRLF
    .replace(/\r/g, '\\n')    // Escape CR
    .replace(/\n/g, '\\n')    // Escape LF
    .substring(0, 5000)       // Limit length to prevent DoS
}

export function generateICS(
  events: Event[], 
  promos: Promo[] = [],
  calendarName: string = 'Calendar Școlar'
): string {
  // Filter only active events
  const filteredEvents = events.filter((e) => e.active)
  
  // Filter active promos that should show on calendar
  const filteredPromos = promos.filter((p) => p.active && p.showOnCalendar)

  // Convert to unified format with sanitization
  const allItems: ICSEvent[] = [
    ...filteredEvents.map(e => ({
      id: e.id,
      title: sanitizeICSText(e.title).substring(0, 200), // Limit title length
      description: e.description ? sanitizeICSText(sanitizeText(e.description)) : null,
      startDate: new Date(e.startDate),
      endDate: e.endDate ? new Date(e.endDate) : null,
      type: e.type,
      imageUrl: sanitizeUrl(e.imageUrl),
      link: null,
    })),
    ...filteredPromos.map(p => ({
      id: p.id,
      title: `📢 ${sanitizeICSText(p.title).substring(0, 200)}`,
      description: p.description ? sanitizeICSText(sanitizeText(p.description)) : null,
      startDate: new Date(p.startDate),
      endDate: new Date(p.endDate),
      type: 'PROMO',
      imageUrl: sanitizeUrl(p.imageUrl),
      link: sanitizeUrl(p.link),
    })),
  ]

  // Sort by start date
  allItems.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  // Sanitize calendar name to prevent injection
  const safeCalendarName = sanitizeICSText(calendarName).substring(0, 100)
  
  // Generate ICS content
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CalendarȘcolar//Calendar Școlar//RO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICS(safeCalendarName)}`,
    'X-WR-TIMEZONE:Europe/Bucharest',
    `X-WR-CALDESC:Calendar școlar oficial pentru România${safeCalendarName !== 'Calendar Școlar' ? ` - ${escapeICS(safeCalendarName)}` : ''}`,
  ]

  for (const item of allItems) {
    const startDateObj = item.startDate
    const endDateObj = item.endDate
    
    // Check if event is all-day
    const startIsMidnight = startDateObj.getUTCHours() === 0 && 
                           startDateObj.getUTCMinutes() === 0 && 
                           startDateObj.getUTCSeconds() === 0
    const endIsEndOfDay = !endDateObj || 
                         (endDateObj.getUTCHours() === 23 && endDateObj.getUTCMinutes() === 59) ||
                         (endDateObj.getUTCHours() === 0 && endDateObj.getUTCMinutes() === 0 && endDateObj.getUTCSeconds() === 0)
    
    // For vacation/holiday/promo events, treat as all-day by default
    const isAllDayType = item.type === 'VACATION' || item.type === 'HOLIDAY' || item.type === 'PROMO'
    const isAllDay = isAllDayType || (startIsMidnight && endIsEndOfDay)
    
    let startDate: string
    let endDate: string
    
    if (isAllDay) {
      startDate = formatICSDateOnly(item.startDate)
      if (endDateObj) {
        // For all-day events, DTEND is exclusive, so add one day
        const endDatePlusOne = new Date(endDateObj)
        endDatePlusOne.setUTCDate(endDatePlusOne.getUTCDate() + 1)
        endDate = formatICSDateOnly(endDatePlusOne)
      } else {
        // Single day event
        const nextDay = new Date(startDateObj)
        nextDay.setUTCDate(nextDay.getUTCDate() + 1)
        endDate = formatICSDateOnly(nextDay)
      }
    } else {
      startDate = formatICSDate(item.startDate)
      endDate = endDateObj ? formatICSDate(endDateObj) : startDate
    }

    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${item.id}@calendarscolar.ro`)
    if (isAllDay) {
      lines.push(`DTSTART;VALUE=DATE:${startDate}`)
      lines.push(`DTEND;VALUE=DATE:${endDate}`)
    } else {
      lines.push(`DTSTART:${startDate}`)
      lines.push(`DTEND:${endDate}`)
    }
    lines.push(`SUMMARY:${escapeICS(item.title)}`)
    lines.push('SEQUENCE:0')
    
    // Build description with image if available (already sanitized in allItems)
    let description = item.description || ''
    if (item.imageUrl) {
      const imageHtml = `<img src="${escapeICS(item.imageUrl)}" alt="${escapeICS(item.title)}" style="max-width: 100%; height: auto;" />`
      description = description 
        ? `${description}\\n\\n${imageHtml}`
        : imageHtml
    }
    
    if (description) {
      lines.push(`DESCRIPTION:${escapeICS(description)}`)
    }

    // Add URL for promos (only if validated)
    if (item.link) {
      lines.push(`URL:${escapeICS(item.link)}`)
    }

    // Add image attachment (only if URL was validated)
    if (item.imageUrl) {
      lines.push(`X-APPLE-CID;VALUE=URI:${escapeICS(item.imageUrl)}`)
      lines.push(`ATTACH;FMTTYPE=image/jpeg:${escapeICS(item.imageUrl)}`)
    }

    lines.push(`DTSTAMP:${formatICSDate(new Date())}`)
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')

  return lines.join('\r\n')
}

function formatICSDate(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

function formatICSDateOnly(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  
  return `${year}${month}${day}`
}

/**
 * Escape special characters for ICS format per RFC 5545
 * Prevents injection of ICS control characters
 */
function escapeICS(text: string): string {
  if (!text) return ''
  
  return text
    .replace(/\\/g, '\\\\')     // Escape backslashes first
    .replace(/;/g, '\\;')       // Escape semicolons
    .replace(/,/g, '\\,')       // Escape commas
    .replace(/\r\n/g, '\\n')    // Escape CRLF
    .replace(/\r/g, '\\n')      // Escape CR
    .replace(/\n/g, '\\n')      // Escape LF
}
