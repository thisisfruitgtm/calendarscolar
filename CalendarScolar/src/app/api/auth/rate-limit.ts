/**
 * Rate limiting for login endpoint
 * 
 * This should be integrated into the NextAuth login flow
 * For now, it's a utility that can be used
 */

import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'

/**
 * Rate limit login attempts: 5 attempts per 15 minutes
 */
export function checkLoginRateLimit(request: Request): { 
  allowed: boolean
  retryAfter?: number 
} {
  const identifier = getClientIdentifier(request)
  const limit = rateLimit(identifier, 5, 15 * 60 * 1000) // 5 attempts per 15 minutes
  
  if (!limit.success) {
    return {
      allowed: false,
      retryAfter: Math.ceil((limit.resetAt - Date.now()) / 1000),
    }
  }
  
  return { allowed: true }
}





