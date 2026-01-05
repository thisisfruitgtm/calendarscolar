/**
 * Rate limiting middleware
 * 
 * Usage example:
 * 
 * import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'
 * 
 * export async function GET(request: Request) {
 *   const identifier = getClientIdentifier(request)
 *   const limit = rateLimit(identifier, 10, 60000) // 10 requests per minute
 *   
 *   if (!limit.success) {
 *     return NextResponse.json(
 *       { error: 'Too many requests' },
 *       { 
 *         status: 429,
 *         headers: {
 *           'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
 *         },
 *       }
 *     )
 *   }
 *   
 *   // ... rest of handler
 * }
 */

export { rateLimit, getClientIdentifier } from './lib/rate-limit'

