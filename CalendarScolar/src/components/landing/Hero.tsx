import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MapPin, ArrowRight, Clock } from 'lucide-react'
import { getCachedActiveCounties, getCachedSettingsMinimal } from '@/lib/cache'
import { CountyAutocomplete } from './CountyAutocomplete'
import { HeroContent } from './HeroContent'

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
        <HeroContent counties={counties} lastUpdate={lastUpdate} />
      </div>
    </section>
  )
}
