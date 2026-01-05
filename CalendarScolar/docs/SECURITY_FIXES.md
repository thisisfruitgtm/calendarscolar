# Security Fixes Implementation Guide

Acest document conține detaliile implementării fix-urilor de securitate.

## ✅ Fix-uri Implementate

### 1. Rate Limiting ✅

**Status**: Implementat (in-memory pentru dev)

**Fișiere modificate**:
- `src/lib/rate-limit.ts` - Utility rate limiting
- `src/app/api/calendar/county/[slug]/route.ts` - Rate limiting calendar feeds
- `src/app/api/track-subscription-action/route.ts` - Rate limiting tracking

**Pentru producție**: Migrează la Redis-based solution:

```bash
npm install @upstash/ratelimit @upstash/redis
```

Apoi actualizează `src/lib/rate-limit.ts` pentru a folosi Upstash Redis.

### 2. XSS Sanitization ✅

**Status**: Implementat complet

**Fișiere modificate**:
- `src/lib/sanitize.ts` - Utility sanitizare
- `src/app/actions/events.ts` - Sanitizare description
- `src/lib/ics-generator.ts` - Sanitizare în ICS

**Funcționalitate**:
- Elimină HTML nesigur din description
- Permite doar tag-uri sigure (p, br, strong, em, etc.)
- Sanitizează și în ICS generator

### 3. Security Headers ✅

**Status**: Implementat complet

**Fișiere modificate**:
- `next.config.ts` - Headers globale
- `src/middleware.ts` - Headers suplimentare

**Headers adăugate**:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security`
- `Referrer-Policy`
- `Permissions-Policy`

### 4. Slug Validation ✅

**Status**: Implementat complet

**Fișiere modificate**:
- `src/app/actions/counties.ts` - Validare în schema
- `src/app/api/calendar/county/[slug]/route.ts` - Validare în API

**Validare**:
- Regex: `/^[a-z0-9-]+$/`
- Doar litere mici, cifre și cratime
- Max 100 caractere

### 5. Error Handling ✅

**Status**: Implementat complet

**Fișiere modificate**:
- Toate Server Actions (`src/app/actions/*.ts`)
- API routes

**Schimbări**:
- Mesaje generice: "Operation failed"
- Nu mai expun informații despre structură

### 6. ID Validation ✅

**Status**: Implementat complet

**Fișiere modificate**:
- Toate Server Actions care folosesc ID-uri
- `src/lib/sanitize.ts` - Helper function

**Validare**:
- Format CUID: `/^c[a-z0-9]{24}$/`
- Validare înainte de query-uri DB

### 7. Session Security ✅

**Status**: Implementat complet

**Fișiere modificate**:
- `src/lib/auth.config.ts`

**Configurare**:
- `maxAge: 30 days`
- `updateAge: 24 hours`

## 🔄 Pentru Producție

### Rate Limiting cu Redis

1. **Setup Upstash Redis**:
   - Creează cont la [upstash.com](https://upstash.com)
   - Creează database Redis
   - Copiază URL și token

2. **Instalare**:
```bash
npm install @upstash/ratelimit @upstash/redis
```

3. **Actualizare `src/lib/rate-limit.ts`**:
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})

export async function rateLimit(identifier: string, maxRequests: number, windowMs: number) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier)
  return {
    success,
    remaining,
    resetAt: reset,
  }
}
```

4. **Variabile de mediu**:
```env
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

### Content Security Policy (CSP)

Pentru CSP mai strict, adaugă în `next.config.ts`:

```typescript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
}
```

**Notă**: CSP poate afecta calendar feeds dacă este prea restrictiv. Testează înainte de deploy.

## 📋 Checklist Pre-Deploy

- [ ] Rate limiting migrat la Redis
- [ ] Toate variabilele de mediu setate
- [ ] Security headers testate
- [ ] Error handling verificat
- [ ] Input validation testată
- [ ] Session security verificată
- [ ] CORS configurat corect
- [ ] Logging configurat (nu loga date sensibile)

## 🔍 Testing

### Test Rate Limiting

```bash
# Test calendar feed rate limit (60 req/min)
for i in {1..65}; do curl -s "https://your-domain.com/api/calendar/county/bucuresti" > /dev/null; done
# Ar trebui să primești 429 după 60 requests
```

### Test XSS Sanitization

```bash
# Test cu HTML în description
curl -X POST "https://your-domain.com/api/events" \
  -H "Content-Type: application/json" \
  -d '{"description": "<script>alert(1)</script>Test"}'
# Script-ul ar trebui să fie eliminat
```

### Test Slug Validation

```bash
# Test cu slug invalid
curl "https://your-domain.com/api/calendar/county/../../etc/passwd"
# Ar trebui să returneze 400
```

## 📚 Resurse

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
