import { describe, it, expect, beforeEach } from 'vitest'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'

describe('rateLimit', () => {
  beforeEach(() => {
    // Reset store between tests
    // Note: This is a limitation of the in-memory implementation
    // In real tests, you'd use a proper test database or mock
  })

  it('should allow requests within limit', () => {
    const result = rateLimit('test-ip', 5, 60000)
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('should block requests over limit', () => {
    const identifier = 'test-ip-block'
    
    // Make 5 requests (limit)
    for (let i = 0; i < 5; i++) {
      const result = rateLimit(identifier, 5, 60000)
      expect(result.success).toBe(true)
    }
    
    // 6th request should be blocked
    const blocked = rateLimit(identifier, 5, 60000)
    expect(blocked.success).toBe(false)
    expect(blocked.remaining).toBe(0)
  })

  it('should reset after window expires', async () => {
    const identifier = 'test-reset'
    
    // Fill up limit
    for (let i = 0; i < 5; i++) {
      rateLimit(identifier, 5, 100) // 100ms window
    }
    
    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 150))
    
    // Should allow again
    const result = rateLimit(identifier, 5, 100)
    expect(result.success).toBe(true)
  })

  it('should return correct resetAt timestamp', () => {
    const now = Date.now()
    const result = rateLimit('test-reset-at', 5, 60000)
    
    expect(result.resetAt).toBeGreaterThan(now)
    expect(result.resetAt).toBeLessThanOrEqual(now + 60000)
  })
})

describe('getClientIdentifier', () => {
  it('should extract IP from x-forwarded-for', () => {
    const request = new Request('http://localhost', {
      headers: {
        'x-forwarded-for': '192.168.1.1, 10.0.0.1',
      },
    })
    
    const identifier = getClientIdentifier(request)
    expect(identifier).toContain('192.168.1.1')
  })

  it('should fallback to x-real-ip', () => {
    const request = new Request('http://localhost', {
      headers: {
        'x-real-ip': '10.0.0.1',
      },
    })
    
    const identifier = getClientIdentifier(request)
    expect(identifier).toContain('10.0.0.1')
  })

  it('should handle missing headers', () => {
    const request = new Request('http://localhost')
    const identifier = getClientIdentifier(request)
    
    expect(identifier).toContain('unknown')
  })
})

