# CalendarScolar.ro

Calendar școlar 2026-2027 conform Ordin Nr. 3.194/2026 (Monitorul Oficial Nr. 126/16.II.2026).

## Tech Stack
- **Framework**: Next.js 16.1.1 (App Router, standalone output)
- **React**: 19.2.3
- **DB**: Prisma ORM + SQLite
- **Auth**: NextAuth v5 (beta.30)
- **CSS**: Tailwind CSS 4 + shadcn/ui (Radix)
- **Testing**: Vitest + Testing Library

## Deployment (Coolify + Nixpacks)
- **Build config**: `nixpacks.toml` — creates temp empty DB for build, deletes after
- **Start script**: `start.sh` — first run seeds DB, subsequent runs apply migrations
- **Production DB**: `file:/data/calendarscolar.db` (persistent volume at `/data`)
- **Env vars** (runtime only, NOT build-time):
  - `DATABASE_URL=file:/data/calendarscolar.db`
  - `AUTH_SECRET=<random>`
  - `AUTH_URL=https://calendarscolar.ro`
  - `NODE_ENV=production`
  - `ADMIN_PASSWORD=<strong password for initial seed>`

## Data Update Procedure
When calendar data needs updating (new ISJ decisions, official corrections):

1. **Create/update migration script** in `prisma/` (idempotent, safe to run multiple times)
2. **Update `prisma/seed.ts`** to match (for fresh deployments)
3. **Update `start.sh`** to reference the new migration script
4. **Test locally**: `npm run db:update`
5. **Push** — Coolify auto-redeploys and runs migration via `start.sh`

Current migration: `prisma/update-2026-2027-official.ts`

## Vacation Groups (Vacanța intersemestrială ISJ/ISMB)
Window: 15 februarie - 7 martie 2027. Each ISJ picks one week:
- **Grupa A** (15-21 feb): Timiș, Caraș-Severin, Gorj, Mehedinți, Dolj, Cluj (ISJ decizie 24.02.2026)
- **Grupa B** (22-28 feb): Arad, Bihor, Satu Mare, Sălaj, Hunedoara, Alba, Sibiu, Vâlcea, Olt, Argeș, Teleorman, Giurgiu, Dâmbovița, Prahova, Brașov
- **Grupa C** (1-7 mar): Maramureș, Bistrița-Năsăud, Mureș, Covasna, Harghita, Suceava, Botoșani, Iași, Neamț, Bacău, Vaslui, Vrancea, Galați, Buzău, Brăila, Ialomița, Călărași, Constanța, Tulcea, Ilfov, București

## Key Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm test -- --run` — run tests
- `npm run db:seed` — full DB reset + seed
- `npm run db:update` — apply migrations (no reset)
- `npm run db:studio` — Prisma Studio GUI

## Admin Access
- Login URL: `/auth-cs7k9` (obfuscated, not linked anywhere public)
- Default admin: `admin@calendarscolar.ro`
- Password set via `ADMIN_PASSWORD` env var during seed

## Important Notes
- `generateStaticParams` in dynamic routes has try/catch for build-time (no DB available)
- `tsx` is in dependencies (not devDependencies) — needed at runtime for seed/migrations
- DNS: Only A record points to Coolify server; MX/SPF/DKIM/DMARC stay on mail server
