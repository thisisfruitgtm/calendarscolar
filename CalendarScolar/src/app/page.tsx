import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Subscribe } from '@/components/landing/Subscribe'
import { LandingCalendar } from '@/components/landing/LandingCalendar'
import { getCachedActiveEvents, getCachedActivePromos, getCachedSettings } from '@/lib/cache'

export default async function Home() {
  // Get all active events (cached)
  const allEvents = await getCachedActiveEvents()
  
  // Get all active promos (cached) - show promos without county filter on landing
  const allPromos = await getCachedActivePromos()

  // Remove counties field before passing to components
  const events = allEvents.map(({ counties, ...event }) => event)
  
  // Only show calendar promos on landing page
  const calendarPromos = allPromos
    .filter(p => p.showOnCalendar)
    .map(({ counties, ...promo }) => promo)

  // Get settings (cached)
  const settings = await getCachedSettings()

  return (
    <main className="min-h-screen">
      <Hero />
      
      {/* Calendar Preview Section with fade */}
      <section className="relative bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden" style={{ height: '700px' }}>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 h-full overflow-hidden z-0">
          <LandingCalendar 
            events={events}
            promos={calendarPromos}
            schoolYear={settings?.schoolYear || '2025-2026'}
            showCalendarDayNumbers={settings?.showCalendarDayNumbers || false}
          />
        </div>
        
        {/* Fade effect at bottom - starts from middle */}
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />
      </section>
      
      {/* Transition section */}
      <section className="py-8 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg text-slate-600 leading-relaxed">
              Ca părinte, știi cât de important este să știi din timp când sunt vacanțele și zilele libere. 
              Cu CalendarȘcolar poți planifica concediile, activitățile extrașcolare și să te organizezi 
              pentru tot anul școlar 2025-2026.
            </p>
          </div>
        </div>
      </section>
      <Features />
      <Subscribe />
    </main>
  )
}
