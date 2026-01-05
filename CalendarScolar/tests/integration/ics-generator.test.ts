import { describe, it, expect } from 'vitest'
import { generateICS } from '@/lib/ics-generator'
import { Event, Promo } from '@prisma/client'

describe('ICS Generator', () => {
  const mockEvent: Omit<Event, 'counties'> = {
    id: 'test-event-1',
    title: 'Test Event',
    description: 'Test description',
    startDate: new Date('2026-01-15T00:00:00Z'),
    endDate: new Date('2026-01-16T00:00:00Z'),
    type: 'HOLIDAY',
    imageUrl: null,
    backgroundColor: null,
    active: true,
    countyId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockPromo: Promo = {
    id: 'test-promo-1',
    title: 'Test Promo',
    description: 'Promo description',
    imageUrl: null,
    link: 'https://example.com',
    startDate: new Date('2026-01-20T00:00:00Z'),
    endDate: new Date('2026-01-25T00:00:00Z'),
    showOnCalendar: true,
    showAsBanner: false,
    backgroundColor: null,
    impressions: 0,
    clicks: 0,
    priority: 0,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should generate valid ICS format', () => {
    const ics = generateICS([mockEvent], [])
    
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('END:VCALENDAR')
    expect(ics).toContain('VERSION:2.0')
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('END:VEVENT')
  })

  it('should include event title', () => {
    const ics = generateICS([mockEvent], [])
    expect(ics).toContain('Test Event')
  })

  it('should include promo in ICS when showOnCalendar is true', () => {
    const ics = generateICS([mockEvent], [mockPromo])
    expect(ics).toContain('📢 Test Promo')
  })

  it('should exclude promo when showOnCalendar is false', () => {
    const inactivePromo = { ...mockPromo, showOnCalendar: false }
    const ics = generateICS([mockEvent], [inactivePromo])
    expect(ics).not.toContain('📢 Test Promo')
  })

  it('should exclude inactive events', () => {
    const inactiveEvent = { ...mockEvent, active: false }
    const ics = generateICS([inactiveEvent], [])
    expect(ics).not.toContain('Test Event')
  })

  it('should format all-day events correctly', () => {
    const ics = generateICS([mockEvent], [])
    expect(ics).toContain('DTSTART;VALUE=DATE:')
    expect(ics).toContain('DTEND;VALUE=DATE:')
  })

  it('should include URL for promos with link', () => {
    const ics = generateICS([], [mockPromo])
    expect(ics).toContain('URL:https://example.com')
  })

  it('should use default calendar name when not specified', () => {
    const ics = generateICS([mockEvent], [])
    expect(ics).toContain('X-WR-CALNAME:Calendar Școlar')
  })

  it('should use custom calendar name when specified', () => {
    const ics = generateICS([mockEvent], [], 'Calendar Școlar - Iași')
    expect(ics).toContain('X-WR-CALNAME:Calendar Școlar - Iași')
  })

  // Security tests
  describe('ICS Security', () => {
    it('should escape special ICS characters in title', () => {
      const maliciousEvent = { 
        ...mockEvent, 
        title: 'Test;Event,With\\Special\nChars' 
      }
      const ics = generateICS([maliciousEvent], [])
      // Should be escaped - semicolons, commas, backslashes, newlines
      expect(ics).toContain('SUMMARY:Test\\;Event\\,With\\\\Special\\\\nChars')
    })

    it('should sanitize dangerous protocols in promo links', () => {
      const maliciousPromo = { 
        ...mockPromo, 
        link: 'javascript:alert(1)' 
      }
      const ics = generateICS([], [maliciousPromo])
      // Should NOT contain the malicious link
      expect(ics).not.toContain('javascript:')
      expect(ics).not.toContain('URL:javascript')
    })

    it('should allow valid HTTPS URLs', () => {
      const validPromo = { 
        ...mockPromo, 
        link: 'https://example.com/safe-page' 
      }
      const ics = generateICS([], [validPromo])
      expect(ics).toContain('URL:https://example.com/safe-page')
    })

    it('should prevent CRLF injection in description', () => {
      const injectionEvent = { 
        ...mockEvent, 
        description: 'Normal text\r\nBEGIN:VEVENT\r\nSUMMARY:Injected' 
      }
      const ics = generateICS([injectionEvent], [])
      // Should escape newlines, preventing injection
      expect(ics).not.toMatch(/\r\nBEGIN:VEVENT\r\nSUMMARY:Injected/)
      expect(ics).toContain('\\n')
    })

    it('should limit title length to prevent DoS', () => {
      const longTitleEvent = { 
        ...mockEvent, 
        title: 'A'.repeat(1000) 
      }
      const ics = generateICS([longTitleEvent], [])
      // Title should be truncated
      expect(ics).not.toContain('A'.repeat(1000))
    })
  })
})

