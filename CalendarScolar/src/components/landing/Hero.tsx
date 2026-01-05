import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MapPin, ArrowRight, Clock } from 'lucide-react'
import { getCachedActiveCounties, getCachedSettingsMinimal } from '@/lib/cache'
import { CountyAutocomplete } from './CountyAutocomplete'

export async function Hero() {
  const counties = await getCachedActiveCounties()

  // Get settings to check last update (cached)
  const settings = await getCachedSettingsMinimal()

  // Format last update date
  const lastUpdate = settings?.updatedAt 
    ? new Intl.DateTimeFormat('ro-RO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(settings.updatedAt))
    : null

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-indigo-50 to-white py-16 sm:py-20">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url(/hero.webp)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/90 via-indigo-50/90 to-white/90" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-200 opacity-20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-indigo-200 opacity-20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Calendar Școlar
            <span className="block mt-2 text-blue-600">2025-2026</span>
          </h1>
          {lastUpdate && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-blue-600">
              <Clock className="h-4 w-4" />
              <span>Ultima actualizare: {lastUpdate}</span>
            </div>
          )}
          <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
            Planifică-ți vacanțele cu luni înainte și nu mai rata nicio zi liberă. 
            Calendar complet pentru toate cele 43 de județe, cu vacanțele intersemestriale 
            specifice fiecărei zone. Tot ce trebuie să știi pentru anul școlar 2025-2026, într-un singur loc.
          </p>
          
          {/* Autocomplete Search */}
          <div className="mt-10 flex justify-center">
            <CountyAutocomplete counties={counties} />
          </div>

          {/* Alternative CTA */}
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
            <Button asChild variant="outline" size="lg">
              <Link href="/judete" className="flex items-center gap-2">
                Vezi Toate Județele
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
