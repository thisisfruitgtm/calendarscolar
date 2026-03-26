import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCachedActiveCounties, getCachedCountyBySlug, getCachedActiveEvents, getCachedActivePromos, getCachedSettings } from '@/lib/cache'
import { CountyHero } from '@/components/county/CountyHero'
import { CountyCalendar } from '@/components/county/CountyCalendar'
import { CountyInfo } from '@/components/county/CountyInfo'
import { StructuredData } from '@/components/seo/StructuredData'
import { PromoBanner } from '@/components/promo/PromoBanner'

interface CountyPageProps {
  params: Promise<{ slug: string }>
}

// Generate static pages for all counties at build time
export async function generateStaticParams() {
  try {
    const counties = await getCachedActiveCounties()
    return counties.map((county) => ({
      slug: county.slug,
    }))
  } catch {
    // DB not available at build time (e.g. Nixpacks/Docker build)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CountyPageProps): Promise<Metadata> {
  const { slug } = await params
  
  const county = await getCachedCountyBySlug(slug)

  if (!county) {
    return {
      title: 'Județ negăsit',
    }
  }

  const title = county.metaTitle || `Calendar Școlar ${county.name} 2026-2027`
  const intersemesterPeriod = county.group?.periods.find(p => p.type === 'INTERSEMESTER')
  const groupSuffix = county.group ? ` | ${county.group.name}` : ''
  const description = county.metaDescription || (
    intersemesterPeriod
      ? `Calendar școlar ${county.name} 2026-2027${groupSuffix}: vacanțe, zile libere și structura completă a anului școlar. Vacanță intersemestrială ${new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long' }).format(new Date(intersemesterPeriod.startDate))} – ${new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long' }).format(new Date(intersemesterPeriod.endDate))}. Descarcă PDF sau adaugă în calendar.`
      : `Calendar școlar ${county.name} 2026-2027: toate vacanțele, zilele libere și structura anului școlar. Descarcă PDF sau sincronizează cu Google Calendar.`
  )

  return {
    title,
    description,
    keywords: [
      `calendar scolar ${county.name.toLowerCase()}`,
      `calendar școlar ${county.name}`,
      `structura anului scolar 2026 ${county.name.toLowerCase()}`,
      `vacanta intersemestriala 2027 ${county.name.toLowerCase()}`,
      `cand incepe scoala 2026 ${county.name.toLowerCase()}`,
      `vacante scolare ${county.name.toLowerCase()} 2026 2027`,
      `zile libere ${county.name}`,
      `scoli ${county.capitalCity.toLowerCase()}`,
      'calendar scolar 2026-2027',
      'calendar școlar 2026-2027',
      'vacanta de vara 2027',
      'structura an scolar 2026',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'ro_RO',
      url: `https://calendarscolar.ro/judet/${county.slug}`,
      siteName: 'Calendar Școlar România',
      images: [
        {
          url: `https://calendarscolar.ro/api/og/${county.slug}`,
          width: 1200,
          height: 630,
          alt: `Calendar Școlar ${county.name} 2026-2027`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://calendarscolar.ro/judet/${county.slug}`,
    },
  }
}

export default async function CountyPage({ params }: CountyPageProps) {
  const { slug } = await params
  
  const county = await getCachedCountyBySlug(slug)

  if (!county) {
    notFound()
  }

  // Get all active events (cached)
  const allEvents = await getCachedActiveEvents()
  
  // Get all active promos (cached)
  const allPromos = await getCachedActivePromos()

  // Filter promos for this county
  type PromoWithCounties = typeof allPromos[0]
  const countyPromos = allPromos.filter((promo: PromoWithCounties) => {
    if (promo.counties.length === 0) return true
    return promo.counties.some((pc: { countyId: string }) => pc.countyId === county.id)
  })

  // Separate banner and calendar promos
  const bannerPromos = countyPromos
    .filter((p: PromoWithCounties) => p.showAsBanner)
    .map(({ counties, ...promo }: PromoWithCounties) => promo)
  
  const calendarPromos = countyPromos
    .filter((p: PromoWithCounties) => p.showOnCalendar)
    .map(({ counties, ...promo }: PromoWithCounties) => promo)

  // Remove counties field before passing to components
  const events = allEvents.map(({ counties, ...event }) => event)

  // Get settings (cached)
  const settings = await getCachedSettings()

  return (
    <>
      <StructuredData county={county} events={events} />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <CountyHero county={county} events={events} />

        {/* Banner Promos */}
        {bannerPromos.length > 0 && (
          <div className="container mx-auto px-4 pt-8">
            {bannerPromos.map((promo) => (
              <PromoBanner key={promo.id} promo={promo} />
            ))}
          </div>
        )}
        
        <div className="container mx-auto px-4 py-12 pb-28 md:pb-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CountyCalendar 
                county={county} 
                events={events}
                promos={calendarPromos}
                schoolYear={settings?.schoolYear || '2026-2027'}
                showCalendarDayNumbers={settings?.showCalendarDayNumbers || false}
              />
            </div>
            
            <aside>
              <CountyInfo county={county} events={events} />
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
