'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { CountyAutocomplete } from './CountyAutocomplete'
import { FadeInUp } from '@/components/ui/fade-in-up'

interface HeroContentProps {
  counties: Array<{ id: string; name: string; slug: string; capitalCity: string }>
  lastUpdate: string | null
}

export function HeroContent({ counties, lastUpdate }: HeroContentProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">

      <FadeInUp duration={700}>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Calendar Școlar
          <span className="block mt-2 text-blue-600">2025-2026</span>
        </h1>
      </FadeInUp>
      
   
      
      <FadeInUp delay={300} duration={600}>
        <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
          Calendarul școlar, acum direct în telefonul tău, în doar 3 click-uri. Simplu pentru părinți dar și pentru copii: toate vacanțele și zilele libere școlare, mereu la îndemână!
        </p>
        {lastUpdate && (
        <FadeInUp delay={150} duration={600}>
          <div className="mt-4 mb-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-blue-700">
              <Clock className="h-4 w-4" />
              <span>Actualizare Ministerul Educației: <b>{lastUpdate}</b></span>
            </div>
          </div>
        </FadeInUp>
      )}
      </FadeInUp>
      
      {/* Autocomplete Search */}
      <FadeInUp delay={450} duration={600}>
        <div className="mt-10 flex justify-center">
          <CountyAutocomplete counties={counties} />
        </div>
      </FadeInUp>

      {/* Alternative CTA */}
      <FadeInUp delay={600} duration={600}>
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
          <Button asChild variant="outline" size="lg">
            <Link href="/judete" className="flex items-center gap-2">
              Vezi Toate Județele
            </Link>
          </Button>
        </div>
      </FadeInUp>
    </div>
  )
}

