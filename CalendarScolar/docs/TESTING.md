# Testing Guide - CalendarScolar

**Framework:** Vitest  
**Status:** ✅ 25 teste implementate, toate trec  
**Ultima actualizare:** 5 Ianuarie 2026

## 📊 Teste Implementate

### ✅ Teste Unit (18 teste)

#### 1. Sanitize Utilities (`tests/unit/sanitize.test.ts`) - 11 teste ✅

**Ce testează:**
- **stripHtml**: Elimină tag-uri HTML și decodează entități HTML
  - ✅ Elimină tag-uri HTML (`<p>Hello</p>` → `Hello`)
  - ✅ Decodează entități HTML (`&amp;` → `&`, `&lt;` → `<`, `&nbsp;` → spațiu)
  - ✅ Gestionează string-uri goale
  
- **sanitizeHtml**: Sanitizare HTML pentru prevenirea XSS
  - ✅ Permite tag-uri sigure (`<p>`, `<strong>`, `<em>`, etc.)
  - ✅ Elimină tag-uri `<script>` (prevenire XSS)
  - ✅ Elimină event handlers (`onclick`, `onerror`, etc.)
  - ✅ Validează URL-uri în `href` (blochează `javascript:`)
  - ✅ Gestionează input null/empty
  
- **sanitizeText**: Alias pentru stripHtml
  - ✅ Elimină toate tag-urile HTML
  
- **isValidCuid**: Validare format CUID (Prisma ID)
  - ✅ Validează format corect (`cmjsp3x79002mrkhwl5y3te9a`)
  - ✅ Respinge format invalid (prea scurt, prea lung, caractere invalide)
  
- **isValidSlug**: Validare format slug
  - ✅ Validează slug corect (`bucuresti`, `judet-42`)
  - ✅ Respinge uppercase, underscore, string gol, prea lung (>100 caractere)

**Importanță:** Aceste teste asigură securitatea aplicației prin prevenirea XSS și validarea input-urilor.

#### 2. Rate Limiting (`tests/unit/rate-limit.test.ts`) - 7 teste ✅

**Ce testează:**
- **rateLimit**: Rate limiting pentru protecție DoS
  - ✅ Permite request-uri în limita permisă
  - ✅ Blochează request-uri peste limită
  - ✅ Resetează după expirarea ferestrei de timp
  - ✅ Returnează timestamp corect pentru reset
  
- **getClientIdentifier**: Extragere identificator client
  - ✅ Extrage IP din header `x-forwarded-for`
  - ✅ Fallback la `x-real-ip` dacă lipsește `x-forwarded-for`
  - ✅ Gestionează lipsa headerelor (returnează `unknown`)

**Importanță:** Aceste teste asigură protecția împotriva atacurilor DoS și rate limiting corect.

### ✅ Teste Integration (7 teste)

#### 3. ICS Generator (`tests/integration/ics-generator.test.ts`) - 7 teste ✅

**Ce testează:**
- **generateICS**: Generare fișiere ICS pentru calendar
  - ✅ Generează format ICS valid (`BEGIN:VCALENDAR`, `END:VCALENDAR`, `VERSION:2.0`)
  - ✅ Include titlul evenimentului în ICS
  - ✅ Include promo-uri în ICS când `showOnCalendar: true`
  - ✅ Exclude promo-uri când `showOnCalendar: false`
  - ✅ Exclude evenimente inactive (`active: false`)
  - ✅ Formatează corect evenimente all-day (`DTSTART;VALUE=DATE:`, `DTEND;VALUE=DATE:`)
  - ✅ Include URL pentru promo-uri cu link

**Importanță:** Aceste teste asigură că feed-urile ICS sunt generate corect și sunt compatibile cu Google Calendar, Apple Calendar, Outlook, etc.

## 📈 Coverage

**Total teste:** 25  
**Teste trecute:** 25 ✅  
**Teste eșuate:** 0  
**Coverage:** Utilitățile critice (sanitize, rate-limit, ICS generator)

## 🚀 Rulare Teste

### Comenzi Disponibile

```bash
# Rulează toate testele
npm test

# Rulează testele în mod watch (re-run automat la schimbări)
npm test -- --watch

# Rulează testele cu UI interactiv
npm test:ui

# Rulează testele cu coverage report
npm test:coverage

# Rulează testele pentru un fișier specific
npm test -- tests/unit/sanitize.test.ts

# Rulează testele într-un mod specific
npm test -- --run  # Run once (CI mode)
```

### Teste la Build

Testele rulează automat la build prin script-ul `build:test`:

```bash
npm run build:test
```

Dacă testele eșuează, build-ul va eșua și nu va genera artefacte.

## 📝 Procedura de Testare

### 1. După Fiecare Funcționalitate Nouă

**Obligatoriu:** Creează teste pentru:
- ✅ Funcționalitatea nouă (unit tests)
- ✅ Integrarea cu sisteme existente (integration tests)
- ✅ Edge cases și error handling

**Pași:**

1. **Identifică ce trebuie testat:**
   - Funcții pure (utilities) → Unit tests
   - Integrări (API routes, Server Actions) → Integration tests
   - Componente React → Component tests (viitor)

2. **Creează fișier de test:**
   ```bash
   # Pentru unit tests
   touch tests/unit/nume-functionalitate.test.ts
   
   # Pentru integration tests
   touch tests/integration/nume-functionalitate.test.ts
   ```

3. **Scrie testele:**
   ```typescript
   import { describe, it, expect } from 'vitest'
   import { functieDeTestat } from '@/path/to/function'
   
   describe('nume functionalitate', () => {
     it('should do something', () => {
       expect(functieDeTestat(input)).toBe(expectedOutput)
     })
     
     it('should handle edge case', () => {
       // test edge case
     })
   })
   ```

4. **Rulează testele:**
   ```bash
   npm test -- tests/unit/nume-functionalitate.test.ts
   ```

5. **Verifică coverage:**
   ```bash
   npm test:coverage
   ```

6. **Commit:**
   ```bash
   git add tests/
   git commit -m "test: add tests for nume-functionalitate"
   ```

### 2. Testare Manuală (Pre-Deploy)

**Checklist:**

- [ ] Teste automate trec (`npm test`)
- [ ] Build reușește (`npm run build`)
- [ ] Testare manuală pe staging:
  - [ ] Creare/editare eveniment
  - [ ] Creare/editare promo
  - [ ] Abonare calendar (Google Calendar, Apple Calendar)
  - [ ] Verificare ICS feed
  - [ ] Verificare tracking promo clicks/impressions
  - [ ] Verificare rate limiting
  - [ ] Verificare validări input
  - [ ] Verificare sanitizare HTML

### 3. Testare Continuă (CI/CD)

**Recomandat:** Configurare CI/CD pentru:
- Rulare automată teste la fiecare commit
- Rulare automată teste la fiecare PR
- Blocare merge dacă testele eșuează

**Exemplu GitHub Actions:**
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test -- --run
      - run: npm run build
```

## 🎯 Best Practices

### 1. Structura Testelor

```typescript
describe('Feature Name', () => {
  describe('functionName', () => {
    it('should do something correctly', () => {
      // Arrange
      const input = 'test'
      
      // Act
      const result = functionName(input)
      
      // Assert
      expect(result).toBe('expected')
    })
    
    it('should handle edge case', () => {
      // Test edge case
    })
  })
})
```

### 2. Naming Conventions

- **Fișiere:** `nume-functionalitate.test.ts`
- **Describe:** `'Feature Name'` sau `'functionName'`
- **It:** `'should do something'` (descriere clară)

### 3. Teste Bune

✅ **DO:**
- Testează comportamentul, nu implementarea
- Testează edge cases
- Testează error handling
- Folosește date de test realiste
- Testează o singură lucru per test

❌ **DON'T:**
- Nu testa detalii de implementare
- Nu scrie teste care depind de altele
- Nu folosi date de test care se schimbă (timestamps, IDs random)
- Nu ignora testele care eșuează

### 4. Mock-uri

Pentru teste care necesită mock-uri (DB, API extern, etc.):

```typescript
import { vi } from 'vitest'

// Mock Prisma
vi.mock('@/lib/db', () => ({
  db: {
    promo: {
      findMany: vi.fn(),
    },
  },
}))
```

## 🔄 Teste de Adăugat (Viitor)

### Prioritate Înaltă

- [ ] Server Actions (`src/app/actions/*.ts`)
  - [ ] `createEvent`, `updateEvent`, `deleteEvent`
  - [ ] `createPromo`, `updatePromo`, `deletePromo`
  - [ ] `createCounty`, `updateCounty`
  - [ ] `toggleEventActive`, `togglePromoActive`

- [ ] API Routes
  - [ ] `/api/calendar/route.ts`
  - [ ] `/api/calendar/[token]/route.ts`
  - [ ] `/api/track-subscription-action/route.ts`

### Prioritate Medie

- [ ] Component Tests (React Testing Library)
  - [ ] `PromoBanner`
  - [ ] `CountyCalendar`
  - [ ] `EventForm`, `PromoForm`

- [ ] E2E Tests (Playwright sau Cypress)
  - [ ] Flow complet: abonare calendar
  - [ ] Flow admin: creare/editare eveniment
  - [ ] Flow admin: creare/editare promo

## 📚 Resurse

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)

## ✅ Checklist Pre-Commit

Înainte de commit, verifică:

- [ ] Toate testele trec (`npm test`)
- [ ] Build reușește (`npm run build`)
- [ ] Nu există console.log/console.error în cod
- [ ] TypeScript nu are erori (`npx tsc --noEmit`)
- [ ] Linter nu are erori (`npm run lint`)

