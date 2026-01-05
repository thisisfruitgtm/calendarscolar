import { Event } from '@prisma/client'
import { ICSOptions } from '@/types'
import { sanitizeText } from './sanitize'

export function generateICS(events: Event[], options: ICSOptions = {}): string {
  const { includeAds = true } = options

  // Filter events
  let filteredEvents = events.filter((e) => e.active)
  if (!includeAds) {
    filteredEvents = filteredEvents.filter((e) => !e.isAd)
  }

  // Generate ICS content
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CalendarȘcolar//Calendar Școlar//RO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Calendar Școlar',
    'X-WR-TIMEZONE:Europe/Bucharest',
    'X-WR-CALDESC:Calendar școlar oficial pentru România',
  ]

  for (const event of filteredEvents) {
    // Check if event is all-day (starts at midnight or close to midnight UTC)
    // For calendar events, we consider them all-day if they start/end at midnight
    const startDateObj = new Date(event.startDate)
    const endDateObj = event.endDate ? new Date(event.endDate) : null
    
    // More lenient check: if hours are 0 or 23:59, consider it all-day
    const startIsMidnight = startDateObj.getUTCHours() === 0 && 
                           startDateObj.getUTCMinutes() === 0 && 
                           startDateObj.getUTCSeconds() === 0
    const endIsEndOfDay = !endDateObj || 
                         (endDateObj.getUTCHours() === 23 && endDateObj.getUTCMinutes() === 59) ||
                         (endDateObj.getUTCHours() === 0 && endDateObj.getUTCMinutes() === 0 && endDateObj.getUTCSeconds() === 0)
    
    // For promo/vacation/holiday events, treat as all-day by default
    const isPromoOrVacation = event.type === 'PROMO' || event.type === 'VACATION' || event.type === 'HOLIDAY'
    const isAllDay = isPromoOrVacation || (startIsMidnight && endIsEndOfDay)
    
    let startDate: string
    let endDate: string
    
    if (isAllDay) {
      startDate = formatICSDateOnly(event.startDate)
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
      startDate = formatICSDate(event.startDate)
      endDate = endDateObj ? formatICSDate(endDateObj) : startDate
    }

    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${event.id}@calendarscolar.ro`)
    if (isAllDay) {
      lines.push(`DTSTART;VALUE=DATE:${startDate}`)
      // For all-day events, DTEND is exclusive (day after the last day)
      lines.push(`DTEND;VALUE=DATE:${endDate}`)
    } else {
      lines.push(`DTSTART:${startDate}`)
      lines.push(`DTEND:${endDate}`)
    }
    lines.push(`SUMMARY:${escapeICS(event.title)}`)
    // Add SEQUENCE to help with updates
    lines.push('SEQUENCE:0')
    
    // Build description with image if available
    // Sanitize description to prevent XSS (remove HTML, keep plain text)
    let description = event.description ? sanitizeText(event.description) : ''
    if (event.imageUrl) {
      // Include image in description for better compatibility
      // Some calendar apps (like Apple Calendar) can display images from description
      // Image URL is already validated as URL in schema
      const imageHtml = `<img src="${escapeICS(event.imageUrl)}" alt="${escapeICS(event.title)}" style="max-width: 100%; height: auto;" />`
      description = description 
        ? `${description}\\n\\n${imageHtml}`
        : imageHtml
    }
    
    if (description) {
      lines.push(`DESCRIPTION:${escapeICS(description)}`)
    }

    // Add URL and image attachments only if not causing issues with Apple Calendar
    // Some calendar apps may ignore events with certain attachments
    if (event.isAd && event.adLink) {
      lines.push(`URL:${event.adLink}`)
    }

    if (event.imageUrl) {
      // Add image as X-APPLE-CID for Apple Calendar (more compatible)
      lines.push(`X-APPLE-CID;VALUE=URI:${event.imageUrl}`)
      // Also add as ATTACH for other calendar apps
      lines.push(`ATTACH;FMTTYPE=image/jpeg:${event.imageUrl}`)
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

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

