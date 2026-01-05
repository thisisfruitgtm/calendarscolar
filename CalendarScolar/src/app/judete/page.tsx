import { Metadata } from 'next'
import { db } from '@/lib/db'
import Link from 'next/link'
import { MapPin, Calendar, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Toate Județele - Calendar Școlar 2025-2026 | CalendarȘcolar.ro',
  description: 'Alege județul tău pentru a vedea calendarul școlar complet. Vacanțe, zile libere și structura anului școlar 2025-2026 pentru toate cele 42 de județe.',
  keywords: [
    'calendar școlar județe',
    'vacanțe școlare România',
    'calendar școlar 2025-2026',
    'zile libere școală',
  ],
  openGraph: {
    title: 'Toate Județele - Calendar Școlar 2025-2026',
    description: 'Alege județul tău pentru a vedea calendarul școlar complet.',
    type: 'website',
    locale: 'ro_RO',
  },
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date))
}

export default async function JudetePage() {
  const groups = await db.vacationGroup.findMany({
    include: {
      counties: {
        where: { active: true },
        orderBy: { name: 'asc' },
      },
      periods: {
        where: { schoolYear: '2025-2026' },
        take: 1,
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
              Calendar Școlar pe Județe
            </h1>
            <p className="mt-4 text-lg text-slate-600 lg:text-xl">
              Alege județul tău pentru a vedea calendarul școlar complet pentru 
              anul 2025-2026, inclusiv vacanțele intersemestriale care diferă 
              de la județ la județ.
            </p>
          </div>
          
          {/* Legend */}
          <div className="mt-12">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">
              Legenda Grupelor de Vacanță
            </h2>
            
            <div className="grid gap-4 sm:grid-cols-3">
              {groups.map((group) => (
                <div 
                  key={group.id}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: `${group.color}10` }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: group.color }}
                    >
                      {group.name.replace('Grupa ', '')}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{group.name}</p>
                      {group.periods[0] && (
                        <p className="text-sm text-slate-600">
                          {formatDate(group.periods[0].startDate)} - {formatDate(group.periods[0].endDate)} 2026
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {group.counties.length} județe
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Groups */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {groups.map((group) => (
              <div key={group.id}>
                {/* Group Header */}
                <div className="mb-6 flex items-center gap-4">
                  <div 
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <h2 className="text-2xl font-bold text-slate-900">
                    {group.name}
                  </h2>
                  {group.periods[0] && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                      {formatDate(group.periods[0].startDate)} - {formatDate(group.periods[0].endDate)}
                    </span>
                  )}
                </div>

                {/* Counties Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.counties.map((county) => (
                    <Link
                      key={county.id}
                      href={`/judet/${county.slug}`}
                      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-lg"
                    >
                      {/* Color accent */}
                      <div 
                        className="absolute inset-x-0 top-0 h-1"
                        style={{ backgroundColor: group.color }}
                      />
                      
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {county.name}
                          </h3>
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                            <MapPin className="h-3.5 w-3.5" />
                            {county.capitalCity}
                          </p>
                        </div>
                        
                        <span 
                          className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                          style={{ backgroundColor: group.color }}
                        >
                          {group.name.replace('Grupa ', '')}
                        </span>
                      </div>

                      {county.population && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                          <Users className="h-3 w-3" />
                          {new Intl.NumberFormat('ro-RO').format(county.population)} loc.
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}


