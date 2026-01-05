/**
 * Rate limiting utilities
 * 
 * NOTE: For production, use a proper rate limiting solution like:
 * - @upstash/ratelimit with Redis
 * - Vercel Edge Config
 * - Next.js middleware with external store
 * 
 * This is a simple in-memory implementation for development.
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetAt: number
  }
}

const store: RateLimitStore = {}

/**
 * Simple in-memory rate limiter
 * WARNING: This is not suitable for production with multiple instances
 * Use Redis-based solution for production
 */
export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const key = identifier

  // Clean expired entries
  Object.keys(store).forEach((k) => {
    if (store[k].resetAt < now) {
      delete store[k]
    }
  })

  const record = store[key]

  if (!record || record.resetAt < now) {
    // New window
    store[key] = {
      count: 1,
      resetAt: now + windowMs,
    }
    return {
      success: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    }
  }

  if (record.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
    }
  }

  record.count++
  return {
    success: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  }
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  // Also include user-agent for more granular limiting
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  return `${ip}:${userAgent.substring(0, 50)}`
}





