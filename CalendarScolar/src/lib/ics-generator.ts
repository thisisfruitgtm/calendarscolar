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

export function generateICS(events: Event[], promos: Promo[] = []): string {
  // Filter only active events
  const filteredEvents = events.filter((e) => e.active)
  
  // Filter active promos that should show on calendar
  const filteredPromos = promos.filter((p) => p.active && p.showOnCalendar)

  // Convert to unified format
  const allItems: ICSEvent[] = [
    ...filteredEvents.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      startDate: new Date(e.startDate),
      endDate: e.endDate ? new Date(e.endDate) : null,
      type: e.type,
      imageUrl: e.imageUrl,
      link: null,
    })),
    ...filteredPromos.map(p => ({
      id: p.id,
      title: `📢 ${p.title}`,
      description: p.description,
      startDate: new Date(p.startDate),
      endDate: new Date(p.endDate),
      type: 'PROMO',
      imageUrl: p.imageUrl,
      link: p.link,
    })),
  ]

  // Sort by start date
  allItems.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

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
    
    // Build description with image if available
    let description = item.description ? sanitizeText(item.description) : ''
    if (item.imageUrl) {
      const imageHtml = `<img src="${escapeICS(item.imageUrl)}" alt="${escapeICS(item.title)}" style="max-width: 100%; height: auto;" />`
      description = description 
        ? `${description}\\n\\n${imageHtml}`
        : imageHtml
    }
    
    if (description) {
      lines.push(`DESCRIPTION:${escapeICS(description)}`)
    }

    // Add URL for promos
    if (item.link) {
      lines.push(`URL:${item.link}`)
    }

    if (item.imageUrl) {
      lines.push(`X-APPLE-CID;VALUE=URI:${item.imageUrl}`)
      lines.push(`ATTACH;FMTTYPE=image/jpeg:${item.imageUrl}`)
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
