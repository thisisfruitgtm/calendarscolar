import { County, VacationGroup, VacationPeriod, Event } from '@prisma/client'
import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { CountyActions } from './CountyActions'

type CountyWithGroup = County & {
  group: (VacationGroup & { periods: VacationPeriod[] }) | null
}

interface CountyHeroProps {
  county: CountyWithGroup & { id: string }
  events: Event[]
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function CountyHero({ county, events }: CountyHeroProps) {
  const nextVacation = county.group?.periods[0]

  return (
    <section 
      className="relative overflow-hidden py-20 lg:py-28"
      style={{
        background: `linear-gradient(135deg, ${county.group?.color || '#3B82F6'}15 0%, ${county.group?.color || '#3B82F6'}30 100%)`,
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full opacity-20"
          style={{ backgroundColor: county.group?.color || '#3B82F6' }}
        />
        <div 
          className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full opacity-10"
          style={{ backgroundColor: county.group?.color || '#3B82F6' }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center justify-center gap-2 text-slate-600">
              <li>
                <Link href="/" className="hover:text-slate-900 transition-colors">
                  Acasă
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/judete" className="hover:text-slate-900 transition-colors">
                  Județe
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium text-slate-900">{county.name}</li>
            </ol>
          </nav>

          {/* Title */}
          <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl xl:text-6xl">
            Calendar Școlar
            <span 
              className="block mt-2"
              style={{ color: county.group?.color || '#3B82F6' }}
            >
              {county.name}
            </span>
          </h1>

          <p className="mb-8 text-center text-lg text-slate-600 max-w-2xl mx-auto lg:text-xl">
            Toate vacanțele și zilele libere pentru anul școlar 2025-2026 
            în județul {county.name}
          </p>

          {/* Stats */}
          {nextVacation && (
            <div className="mb-6 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-3 px-5 py-3">
                <Calendar className="h-5 w-5 text-slate-900" />
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-slate-900">
                    Vacanța intersemestrială
                  </p>
                  <p className="font-semibold text-slate-900">
                    {formatDate(nextVacation.startDate)} - {formatDate(nextVacation.endDate)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-6 pb-24 md:pb-0">
            <CountyActions county={county} events={events} />
          </div>
        </div>
      </div>
    </section>
  )
}

