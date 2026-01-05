# CalendarScolar.ro

Platformă web completă pentru calendar școlar oficial cu sincronizare automată prin format ICS pentru toate cele 42 de județe + București.

## 📋 Cuprins

- [Caracteristici](#caracteristici)
- [Tehnologii](#tehnologii)
- [Arhitectură](#arhitectură)
- [Structură Proiect](#structură-proiect)
- [Setup & Instalare](#setup--instalare)
- [Configurare](#configurare)
- [Baza de Date](#baza-de-date)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Scripts Utile](#scripts-utile)
- [Troubleshooting](#troubleshooting)

## ✨ Caracteristici

### Funcționalități Principale

- 📅 **Calendar școlar complet** pentru toate cele 42 de județe + București
- 🔄 **Sincronizare automată ICS** - Compatibil cu toate calendarele majore:
  - ✅ **Google Calendar** - Prin link direct
  - ✅ **Apple Calendar** - Prin protocol `webcal://`
  - ✅ **Outlook/Microsoft 365** - Prin link direct
  - ✅ **Orice aplicație calendar** - Prin URL feed ICS standard
- 🎯 **Panou de administrare** complet pentru gestionarea evenimentelor
- 📸 **Suport imagini** în evenimente (upload prin Uploadthing)
- 💰 **Sistem promo/reclame** - free vs premium (fără reclame)
- 🔐 **Autentificare cu roluri** - Admin, Editor, Viewer
- 📊 **Statistici** - tracking pentru abonări și acțiuni
- 🗺️ **Grupe de vacanță** - Grupa A, B, C pentru vacanța intersemestrială
- 🎨 **UI modern** cu TailwindCSS și shadcn/ui
- 📱 **Responsive design** - optimizat pentru mobile și desktop
- 🔍 **SEO optimizat** - meta tags, structured data, sitemap

### Tipuri de Evenimente

- **VACATION** - Vacanțe (iarnă, primăvară, vară, intersemestrială)
- **HOLIDAY** - Sărbători legale
- **LAST_DAY** - Ultima zi de cursuri
- **SEMESTER_START** - Început semestru
- **SEMESTER_END** - Sfârșit semestru
- **PROMO** - Evenimente promoționale/reclame

## 🛠 Tehnologii

### Core Stack

- **Next.js 16.1** - React framework cu App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Prisma 6** - ORM pentru baza de date
- **NextAuth v5** - Autentificare și autorizare
- **TailwindCSS v4** - Stilizare utility-first
- **shadcn/ui** - Componente UI reusabile

### Servicii Externe

- **Uploadthing** - Upload și hosting imagini
- **SQLite** (dev) / **PostgreSQL** (prod) - Baza de date

### Biblioteci Importante

- **date-fns** - Manipulare date
- **zod** - Validare schema
- **react-hook-form** - Gestionare formulare
- **bcryptjs** - Hash parole
- **pino** - Logging

## 🏗 Arhitectură

### Pattern-uri Folosite

- **Server Components** - Default în Next.js 16
- **Server Actions** - Pentru mutații (CRUD operations)
- **API Routes** - Pentru endpoints publice (ICS feeds)
- **Middleware** - Protecție rute admin
- **Static Generation** - Pagini județe generate static

### Flux de Date

```
User → Next.js Page → Server Component → Prisma → SQLite/PostgreSQL
                    ↓
              Server Action → Validation (Zod) → Database
                    ↓
              Revalidation → Cache Update
```

### Calendar ICS Flow

```
Calendar App → /api/calendar/county/[slug] → generateICS() → ICS File
                                                      ↓
                                              Apple Calendar
```

## 📁 Structură Proiect

```
CalendarScolar/
├── prisma/
│   ├── schema.prisma          # Schema baza de date
│   ├── seed.ts                # Date inițiale (județe, evenimente)
│   └── dev.db                 # SQLite database (dev)
│
├── public/                     # Assets statice
│   └── *.svg                   # Icoane
│
├── scripts/                    # Scripts utilitare
│   ├── add-test-promo.ts      # Creare promo test
│   └── create-promo-*.ts      # Scripts promo
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── actions/           # Server Actions
│   │   │   ├── counties.ts   # CRUD județe
│   │   │   ├── events.ts      # CRUD evenimente
│   │   │   └── settings.ts    # Setări aplicație
│   │   │
│   │   ├── admin/             # Panou administrare
│   │   │   ├── events/        # Gestionare evenimente
│   │   │   │   ├── new/       # Adăugare eveniment
│   │   │   │   └── [id]/      # Editare eveniment
│   │   │   ├── counties/      # Gestionare județe
│   │   │   ├── ads/           # Gestionare reclame
│   │   │   ├── subscribers/   # Statistici abonări
│   │   │   └── settings/      # Setări aplicație
│   │   │
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── calendar/      # ICS calendar feeds
│   │   │   │   ├── route.ts   # Feed general
│   │   │   │   ├── [token]/   # Feed premium (fără reclame)
│   │   │   │   └── county/[slug]/ # Feed per județ
│   │   │   ├── uploadthing/   # Upload imagini
│   │   │   └── track-subscription-action/ # Tracking
│   │   │
│   │   ├── judet/[slug]/      # Pagină județ (static)
│   │   ├── judete/            # Listă județe
│   │   ├── admin-login/       # Login admin
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   ├── providers.tsx      # React providers
│   │   └── sitemap.ts         # Sitemap generat
│   │
│   ├── components/
│   │   ├── admin/             # Componente admin
│   │   │   ├── EventForm.tsx  # Formular eveniment
│   │   │   ├── CountyForm.tsx # Formular județ
│   │   │   └── ...
│   │   │
│   │   ├── county/            # Componente pagină județ
│   │   │   ├── CountyHero.tsx # Header județ
│   │   │   ├── CountyCalendar.tsx # Calendar vizual
│   │   │   ├── CountyActions.tsx  # Acțiuni subscribe
│   │   │   └── ...
│   │   │
│   │   ├── landing/           # Componente landing
│   │   │   ├── Hero.tsx       # Hero section
│   │   │   ├── Subscribe.tsx # Section subscribe
│   │   │   └── ...
│   │   │
│   │   ├── seo/               # SEO components
│   │   │   └── StructuredData.tsx # JSON-LD
│   │   │
│   │   └── ui/                # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       └── ...
│   │
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── auth.config.ts     # Auth configuration
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── ics-generator.ts   # Generator ICS calendar
│   │   └── utils.ts           # Utilitare
│   │
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   │
│   └── middleware.ts          # Next.js middleware (auth)
│
├── .env                        # Variabile de mediu (local)
├── .env.example                # Template variabile de mediu
├── .cursorrules                # Reguli cod
├── components.json             # shadcn/ui config
├── next.config.ts              # Next.js config
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
└── tailwind.config.ts          # Tailwind config
```

## 🚀 Setup & Instalare

### Cerințe

- **Node.js** 20+ (recomandat LTS)
- **npm** sau **yarn** sau **pnpm**
- **Git**

### Pași Instalare

#### 1. Clonează Repository-ul

```bash
git clone <repository-url>
cd CalendarScolar
```

#### 2. Instalează Dependențele

```bash
npm install
# sau
yarn install
# sau
pnpm install
```

#### 3. Configurează Variabilele de Mediu

Creează fișierul `.env` bazat pe `.env.example`:

```bash
cp .env.example .env
```

Completează valorile (vezi secțiunea [Configurare](#configurare))

#### 4. Setup Baza de Date

```bash
# Generează Prisma Client
npx prisma generate

# Creează baza de date și aplică schema
npx prisma db push

# Populează cu date inițiale (județe, evenimente, admin user)
npm run db:seed
```

#### 5. Rulează Aplicația

```bash
npm run dev
```

Aplicația va fi disponibilă la `http://localhost:3000`

## ⚙️ Configurare

### Variabile de Mediu

Creează fișierul `.env` în root-ul proiectului:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="your-secret-here"  # Generează cu: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Uploadthing (pentru upload imagini)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Public URL (pentru calendar feeds)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Generare AUTH_SECRET

```bash
openssl rand -base64 32
```

### Setup Uploadthing

1. Creează cont la [uploadthing.com](https://uploadthing.com)
2. Creează o aplicație nouă
3. Copiază `UPLOADTHING_SECRET` și `UPLOADTHING_APP_ID`
4. Adaugă-le în `.env`

### Credențiale Default

După `npm run db:seed`, poți folosi:

- **Email**: `admin@calendarscolar.ro`
- **Parolă**: `admin123`

**⚠️ IMPORTANT**: Schimbă parola imediat în producție!

## 🗄 Baza de Date

### Schema Principală

#### Models

- **User** - Utilizatori (Admin, Editor, Viewer)
- **Event** - Evenimente calendar (vacanțe, sărbători, promo)
- **County** - Județe României (42 + București)
- **VacationGroup** - Grupe vacanță (A, B, C)
- **VacationPeriod** - Perioade vacanță per grupă
- **Settings** - Setări aplicație
- **CalendarSubscription** - Tracking abonări calendar
- **SubscriptionAction** - Tracking click-uri subscribe

### Comenzi Prisma

```bash
# Generează Prisma Client
npx prisma generate

# Aplică schimbări schema (dev)
npx prisma db push

# Migrații (prod)
npx prisma migrate dev

# Deschide Prisma Studio (GUI pentru DB)
npm run db:studio

# Seed baza de date
npm run db:seed
```

### Structură Date

#### Event

```typescript
{
  id: string
  title: string
  description?: string
  startDate: DateTime
  endDate?: DateTime
  type: EventType  // VACATION | HOLIDAY | LAST_DAY | SEMESTER_START | SEMESTER_END | PROMO
  imageUrl?: string
  isAd: boolean
  adLink?: string
  active: boolean
  countyId?: string
}
```

#### County

```typescript
{
  id: string
  name: string  // "București"
  slug: string  // "bucuresti"
  capitalCity: string  // "București"
  population?: number
  groupId?: string  // Grupa A, B sau C
  metaTitle?: string
  metaDescription?: string
  active: boolean
}
```

## 🔌 API Endpoints

### Calendar Feeds (ICS)

**Compatibilitate:** Toate feed-urile ICS sunt compatibile cu toate aplicațiile de calendar majore:
- ✅ **Google Calendar** - Desktop, Web, Mobile
- ✅ **Apple Calendar** - Mac, iPhone, iPad
- ✅ **Outlook/Microsoft 365** - Desktop, Web, Mobile
- ✅ **Thunderbird** - Desktop
- ✅ **Orice aplicație calendar** - Standard ICS/RFC 5545

#### Feed General

```
GET /api/calendar
```

Returnează calendar ICS cu toate evenimentele active.

**Query params:**
- `token` (opțional) - Dacă este prezent, exclude reclamele

#### Feed Premium (Fără Reclame)

```
GET /api/calendar/[token]
```

Returnează calendar ICS fără reclame pentru utilizatori premium.

#### Feed per Județ

```
GET /api/calendar/county/[slug]
```

Returnează calendar ICS pentru un județ specific.

**Exemplu:**
```
GET /api/calendar/county/bucuresti
```

**Headers:**
- `Content-Type: text/calendar; charset=utf-8`
- `Cache-Control: no-cache, no-store, must-revalidate`

### Link-uri Subscribe Calendar

Aplicația generează automat link-uri pentru subscribe în toate calendarele majore:

#### Google Calendar
```
https://calendar.google.com/calendar/render?cid={FEED_URL}
```
- Deschide Google Calendar și permite adăugarea calendarului
- Funcționează pe desktop și mobile
- Sincronizare automată periodică

#### Apple Calendar
```
webcal://{FEED_URL_WITHOUT_PROTOCOL}
```
- Deschide automat Apple Calendar pe Mac/iPhone
- Folosește protocolul `webcal://` care este convertit automat la `https://`
- Sincronizare automată periodică (15-30 minute)

#### Outlook/Microsoft 365
```
https://outlook.live.com/calendar/0/addcalendar?url={FEED_URL}
```
- Deschide Outlook web și permite adăugarea calendarului
- Funcționează și pentru aplicația desktop Outlook
- Sincronizare automată periodică

#### Alte Aplicații Calendar
Orice aplicație calendar care suportă ICS poate folosi direct URL-ul feed-ului:
```
https://your-domain.com/api/calendar/county/bucuresti
```
- Compatibil cu Thunderbird, Evolution, etc.
- Standard ICS/RFC 5545

**Notă:** Promo-urile și evenimentele adăugate din admin apar automat în toate calendarele după refresh/sincronizare.

### Tracking

#### Track Subscription Action

```
POST /api/track-subscription-action
```

Body:
```json
{
  "countyId": "string",
  "actionType": "google" | "apple" | "outlook" | "copy_url"
}
```

### Upload

#### Upload Imagine

```
POST /api/uploadthing/[...slug]
```

Endpoint Uploadthing pentru upload imagini.

## 📦 Deployment

### Vercel (Recomandat)

#### 1. Pregătire

```bash
# Build local pentru test
npm run build

# Verifică dacă build-ul funcționează
npm run start
```

#### 2. Deploy pe Vercel

1. Push codul pe GitHub
2. Conectează repository-ul la Vercel
3. Configurează variabilele de mediu în Vercel Dashboard
4. Deploy!

#### Variabile de Mediu Vercel

```env
DATABASE_URL="postgresql://..."  # Vercel Postgres sau Supabase
AUTH_SECRET="your-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
UPLOADTHING_SECRET="your-secret"
UPLOADTHING_APP_ID="your-app-id"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

#### 3. Setup Baza de Date Producție

```bash
# Conectează-te la baza de date producție
npx prisma migrate deploy

# Sau folosește Prisma Studio cu DATABASE_URL producție
DATABASE_URL="postgresql://..." npx prisma studio
```

### Database Producție

**Opțiuni:**

1. **Vercel Postgres** - Integrat cu Vercel
2. **Supabase** - PostgreSQL gratuit
3. **Railway** - PostgreSQL simplu
4. **Neon** - Serverless PostgreSQL

**Migrație:**

```bash
# Setează DATABASE_URL producție
export DATABASE_URL="postgresql://..."

# Rulează migrațiile
npx prisma migrate deploy

# Seed date inițiale (opțional)
npm run db:seed
```

## 📜 Scripts Utile

### NPM Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:3000)

# Build & Production
npm run build            # Build pentru producție
npm run start            # Start server producție

# Database
npm run db:push          # Push schema la DB (dev)
npm run db:studio        # Deschide Prisma Studio
npm run db:seed          # Populează DB cu date inițiale

# Code Quality
npm run lint             # Run ESLint
```

### Scripts Custom

Scripts în folderul `scripts/`:

```bash
# Creare promo test
npx tsx scripts/create-promo-jan-2026.ts

# Creare promo cu imagine
npx tsx scripts/create-promo-with-image.ts
```

## 🔧 Troubleshooting

### Probleme Comune

#### 1. Calendar nu apare în Apple Calendar

**Cauze posibile:**
- URL-ul folosește `localhost` - nu funcționează pe device-uri reale
- Cache Apple Calendar - forțează refresh (Cmd+R)

**Soluții:**
- Folosește tunneling (ngrok, cloudflared) pentru testare locală
- Verifică că URL-ul feed-ului este accesibil public
- Șterge și adaugă din nou calendarul în Apple Calendar

#### 2. Promo-uri nu apar în calendar

**Cauze posibile:**
- Anul greșit (ex: 2025 în loc de 2026)
- `isAd: true` și `adsEnabled: false` în settings
- Format date greșit

**Soluții:**
- Verifică că data este în anul corect
- Verifică setările (`/admin/settings`)
- Folosește format: `2026-01-15T00:00:00Z` pentru startDate

#### 3. Eroare Prisma

```bash
# Regenerare Prisma Client
npx prisma generate

# Reset baza de date (dev)
rm prisma/dev.db
npx prisma db push
npm run db:seed
```

#### 4. Eroare Uploadthing

- Verifică că `UPLOADTHING_SECRET` și `UPLOADTHING_APP_ID` sunt corecte
- Verifică că endpoint-ul este configurat corect în Uploadthing Dashboard

#### 5. Build Errors

```bash
# Clean build
rm -rf .next
npm run build
```

### Debug

#### Logs

Aplicația folosește **pino** pentru logging. Logs-urile apar în consolă în development.

#### Prisma Studio

```bash
npm run db:studio
```

Deschide GUI pentru a vizualiza și edita datele din baza de date.

#### Next.js Debug

```bash
# Debug mode
DEBUG=* npm run dev
```

## 📚 Resurse

### Documentație

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

### Calendar ICS

- [RFC 5545](https://tools.ietf.org/html/rfc5545) - iCalendar specification
- [Apple Calendar Support](https://support.apple.com/guide/calendar/subscribe-to-calendars-icl1022/mac)

## 📝 Licență

Privat - CalendarScolar.ro

## 👥 Contribuții

Pentru întrebări sau sugestii, contactează echipa de dezvoltare.

---

**Ultima actualizare**: Decembrie 2025
