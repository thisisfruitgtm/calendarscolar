/**
 * Sanitization utilities for user input
 */

/**
 * Strip HTML tags from text (edge-safe, no DOM required)
 * Use this for plain text output like ICS files
 */
export function stripHtml(text: string): string {
  if (!text) return ''
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim()
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * Custom implementation that works server-side without jsdom
 */
const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li']
const ALLOWED_ATTRS = ['href', 'target', 'rel']

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url, 'http://localhost')
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

export async function sanitizeHtml(html: string): Promise<string> {
  if (!html || typeof html !== 'string') return ''
  
  // Remove script tags and event handlers
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
  
  // Allow only specific tags
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  sanitized = sanitized.replace(tagRegex, (match, tagName) => {
    const lowerTag = tagName.toLowerCase()
    
    // Closing tag
    if (match.startsWith('</')) {
      return ALLOWED_TAGS.includes(lowerTag) ? match : ''
    }
    
    // Opening tag
    if (!ALLOWED_TAGS.includes(lowerTag)) {
      return ''
    }
    
    // Extract attributes
    const attrRegex = /(\w+)\s*=\s*["']([^"']*)["']/g
    const allowedAttrs: string[] = []
    let attrMatch
    
    while ((attrMatch = attrRegex.exec(match)) !== null) {
      const [_, attrName, attrValue] = attrMatch
      const lowerAttr = attrName.toLowerCase()
      
      if (ALLOWED_ATTRS.includes(lowerAttr)) {
        if (lowerAttr === 'href' && !isValidUrl(attrValue)) {
          continue // Skip invalid URLs
        }
        allowedAttrs.push(`${lowerAttr}="${escapeHtml(attrValue)}"`)
      }
    }
    
    return `<${lowerTag}${allowedAttrs.length > 0 ? ' ' + allowedAttrs.join(' ') : ''}>`
  })
  
  return sanitized
}

/**
 * Sanitize plain text - removes all HTML (alias for stripHtml)
 */
export function sanitizeText(text: string): string {
  return stripHtml(text)
}

/**
 * Validate CUID format
 */
export function isValidCuid(id: string): boolean {
  return /^c[a-z0-9]{24}$/.test(id)
}

/**
 * Validate slug format (lowercase letters, numbers, hyphens only)
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length > 0 && slug.length <= 100
}

