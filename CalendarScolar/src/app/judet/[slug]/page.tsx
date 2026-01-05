import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCachedActiveCounties, getCachedCountyBySlug, getCachedActiveEvents, getCachedSettings } from '@/lib/cache'
import { CountyHero } from '@/components/county/CountyHero'
import { CountyCalendar } from '@/components/county/CountyCalendar'
import { CountyInfo } from '@/components/county/CountyInfo'
import { StructuredData } from '@/components/seo/StructuredData'

interface CountyPageProps {
  params: Promise<{ slug: string }>
}

// Generate static pages for all counties at build time
export async function generateStaticParams() {
  const counties = await getCachedActiveCounties()

  return counties.map((county) => ({
    slug: county.slug,
  }))
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

  const title = county.metaTitle || `Calendar Școlar ${county.name} 2025-2026`
  const description = county.metaDescription || 
    `Calendar școlar complet pentru județul ${county.name}. Vezi vacanțele, zilele libere și structura anului școlar 2025-2026.`

  return {
    title,
    description,
    keywords: [
      `calendar școlar ${county.name}`,
      `vacanțe școlare ${county.name}`,
      `zile libere ${county.name}`,
      `școli ${county.capitalCity}`,
      'calendar școlar 2025-2026',
      'vacanța de iarnă',
      'vacanța de primăvară',
      'vacanța de vară',
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
          alt: `Calendar Școlar ${county.name} 2025-2026`,
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

  // Get all active events with their county associations (cached)
  const allEvents = await getCachedActiveEvents()

  // Filter events based on county:
  // - Non-ad events: include all
  // - Ad events with no counties: include all (for all counties)
  // - Ad events with counties: include only if this county is in the list
  const filteredEvents = allEvents.filter((event) => {
    if (!event.isAd) {
      return true // Include all non-ad events
    }
    
    // If ad has no counties associated, it's for all counties
    if (event.counties.length === 0) {
      return true
    }
    
    // Check if this county is in the ad's county list
    return event.counties.some(ec => ec.countyId === county.id)
  })

  // Remove counties field before passing to components
  const events = filteredEvents.map(({ counties, ...event }) => event)

  // Get settings (cached)
  const settings = await getCachedSettings()

  return (
    <>
      <StructuredData county={county} events={events} />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <CountyHero county={county} events={events} />
        
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CountyCalendar 
                county={county} 
                events={events}
                schoolYear={settings?.schoolYear || '2025-2026'}
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

