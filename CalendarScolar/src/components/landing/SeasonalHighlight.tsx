import { Event } from '@prisma/client'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface SeasonalHighlightProps {
  events: Omit<Event, 'counties'>[]
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'long',
  }).format(new Date(date))
}

function getDaysUntil(date: Date): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function isCurrentEvent(event: Omit<Event, 'counties'>): boolean {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const start = new Date(event.startDate)
  start.setHours(0, 0, 0, 0)
  const end = event.endDate ? new Date(event.endDate) : start
  end.setHours(0, 0, 0, 0)
  return now >= start && now <= end
}

type EventCategory = 'VACATION' | 'HOLIDAY' | 'SEMESTER_START' | 'SEMESTER_END' | 'LAST_DAY' | 'OTHER'

function getEventEmoji(type: EventCategory): string {
  switch (type) {
    case 'VACATION': return '🏖️'
    case 'HOLIDAY': return '🎉'
    case 'SEMESTER_START': return '📚'
    case 'SEMESTER_END': return '🎒'
    case 'LAST_DAY': return '🎓'
    default: return '📅'
  }
}

function getEventColor(type: EventCategory): string {
  switch (type) {
    case 'VACATION': return 'from-amber-50 to-orange-50 border-amber-200'
    case 'HOLIDAY': return 'from-rose-50 to-pink-50 border-rose-200'
    case 'SEMESTER_START': return 'from-blue-50 to-indigo-50 border-blue-200'
    case 'SEMESTER_END': return 'from-violet-50 to-purple-50 border-violet-200'
    case 'LAST_DAY': return 'from-emerald-50 to-green-50 border-emerald-200'
    default: return 'from-slate-50 to-gray-50 border-slate-200'
  }
}

export function SeasonalHighlight({ events }: SeasonalHighlightProps) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  // Find current active event(s)
  const currentEvents = events.filter(isCurrentEvent)

  // Find next upcoming events (not started yet)
  const upcomingEvents = events
    .filter(e => {
      const start = new Date(e.startDate)
      start.setHours(0, 0, 0, 0)
      return start > now
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3)

  // Pick the most relevant current event (prefer vacations/holidays over semester events)
  const priorityOrder: EventCategory[] = ['VACATION', 'HOLIDAY', 'LAST_DAY', 'SEMESTER_END', 'SEMESTER_START', 'OTHER']
  const currentEvent = currentEvents.sort((a, b) => {
    return priorityOrder.indexOf(a.type as EventCategory) - priorityOrder.indexOf(b.type as EventCategory)
  })[0]

  const nextEvent = upcomingEvents[0]

  if (!currentEvent && !nextEvent) return null

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-center mb-2">
            Următorul eveniment din calendarul școlar
          </h2>
          <p className="text-center text-slate-600 mb-8">
            Evenimentele importante din calendarul școlar, actualizate conform ordinului Ministerului Educației
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Event */}
            {currentEvent && (
              <div className={`rounded-2xl bg-gradient-to-br ${getEventColor(currentEvent.type as EventCategory)} border p-6 relative overflow-hidden`}>
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    Acum
                  </span>
                </div>
                <div className="text-3xl mb-3">{getEventEmoji(currentEvent.type as EventCategory)}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {currentEvent.title}
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  {formatShortDate(currentEvent.startDate)}
                  {currentEvent.endDate && ` – ${formatShortDate(currentEvent.endDate)}`}
                </p>
                {currentEvent.description && (
                  <p className="text-sm text-slate-500 line-clamp-2">{currentEvent.description}</p>
                )}
              </div>
            )}

            {/* Next Event */}
            {nextEvent && (
              <div className={`rounded-2xl bg-gradient-to-br ${getEventColor(nextEvent.type as EventCategory)} border p-6`}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {getDaysUntil(nextEvent.startDate) === 1
                      ? 'Mâine'
                      : `Peste ${getDaysUntil(nextEvent.startDate)} zile`}
                  </span>
                </div>
                <div className="text-3xl mb-3">{getEventEmoji(nextEvent.type as EventCategory)}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {nextEvent.title}
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  {formatDate(nextEvent.startDate)}
                  {nextEvent.endDate && ` – ${formatDate(nextEvent.endDate)}`}
                </p>
                {nextEvent.description && (
                  <p className="text-sm text-slate-500 line-clamp-2">{nextEvent.description}</p>
                )}
              </div>
            )}
          </div>

          {/* Upcoming events timeline */}
          {upcomingEvents.length > 1 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Următoarele evenimente
              </h3>
              <div className="space-y-3">
                {upcomingEvents.slice(currentEvent ? 0 : 1).map((event) => (
                  <div key={event.id} className="flex items-center gap-4 rounded-lg border border-slate-100 bg-white p-3 hover:border-slate-200 transition-colors">
                    <div className="text-xl">{getEventEmoji(event.type as EventCategory)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{event.title}</p>
                      <p className="text-xs text-slate-500">
                        {formatShortDate(event.startDate)}
                        {event.endDate && ` – ${formatShortDate(event.endDate)}`}
                      </p>
                    </div>
                    <div className="text-xs text-slate-500 whitespace-nowrap">
                      {getDaysUntil(event.startDate) === 1
                        ? 'mâine'
                        : `${getDaysUntil(event.startDate)} zile`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/judete" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Vezi calendarul complet pe județe
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
