import { describe, it, expect } from 'vitest'
import { stripHtml, sanitizeHtml, sanitizeText, isValidCuid, isValidSlug } from '@/lib/sanitize'

describe('sanitize utilities', () => {
  describe('stripHtml', () => {
    it('should remove all HTML tags', () => {
      expect(stripHtml('<p>Hello</p>')).toBe('Hello')
      expect(stripHtml('<div><span>Test</span></div>')).toBe('Test')
    })

    it('should decode HTML entities', () => {
      expect(stripHtml('&amp;')).toBe('&')
      expect(stripHtml('&lt;')).toBe('<')
      expect(stripHtml('text&nbsp;more')).toBe('text more')
      expect(stripHtml('&nbsp;text')).toBe('text')
    })

    it('should handle empty strings', () => {
      expect(stripHtml('')).toBe('')
      expect(stripHtml('<p></p>')).toBe('')
    })
  })

  describe('sanitizeHtml', () => {
    it('should allow safe HTML tags', async () => {
      const result = await sanitizeHtml('<p>Hello <strong>world</strong></p>')
      expect(result).toContain('<p>')
      expect(result).toContain('<strong>')
      expect(result).toContain('Hello')
    })

    it('should remove script tags', async () => {
      const result = await sanitizeHtml('<p>Hello</p><script>alert("xss")</script>')
      expect(result).not.toContain('<script>')
      expect(result).toContain('<p>Hello</p>')
    })

    it('should remove event handlers', async () => {
      const result = await sanitizeHtml('<p onclick="alert(1)">Hello</p>')
      expect(result).not.toContain('onclick')
    })

    it('should validate URLs in href', async () => {
      const result = await sanitizeHtml('<a href="https://example.com">Link</a>')
      expect(result).toContain('href="https://example.com"')
      
      const invalid = await sanitizeHtml('<a href="javascript:alert(1)">Link</a>')
      expect(invalid).not.toContain('href="javascript:')
    })

    it('should handle empty input', async () => {
      expect(await sanitizeHtml('')).toBe('')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(await sanitizeHtml(null as any)).toBe('')
    })
  })

  describe('sanitizeText', () => {
    it('should strip all HTML', () => {
      expect(sanitizeText('<p>Hello</p>')).toBe('Hello')
      expect(sanitizeText('<strong>Bold</strong>')).toBe('Bold')
    })
  })

  describe('isValidCuid', () => {
    it('should validate CUID format', () => {
      expect(isValidCuid('cmjsp3x79002mrkhwl5y3te9a')).toBe(true)
      expect(isValidCuid('invalid')).toBe(false)
      expect(isValidCuid('')).toBe(false)
      expect(isValidCuid('cmjsp3x79002mrkhwl5y3te9aX')).toBe(false) // too long
    })
  })

  describe('isValidSlug', () => {
    it('should validate slug format', () => {
      expect(isValidSlug('bucuresti')).toBe(true)
      expect(isValidSlug('judet-42')).toBe(true)
      expect(isValidSlug('Bucuresti')).toBe(false) // uppercase
      expect(isValidSlug('judet_42')).toBe(false) // underscore
      expect(isValidSlug('')).toBe(false)
      expect(isValidSlug('a'.repeat(101))).toBe(false) // too long
    })
  })
})

