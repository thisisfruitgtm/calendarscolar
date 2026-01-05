'use client'

import { useState, useMemo } from 'react'
import { County, VacationGroup, VacationPeriod, Event, Promo } from '@prisma/client'
import { Calendar as CalendarIcon, Sun, Leaf, TreePine, List, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

type CountyWithGroup = County & {
  group: (VacationGroup & { periods: VacationPeriod[] }) | null
}

type PromoWithoutCounties = Omit<Promo, 'counties'>

interface CountyCalendarProps {
  county: CountyWithGroup
  events: Event[]
  promos?: PromoWithoutCounties[]
  schoolYear: string
  showCalendarDayNumbers?: boolean
}

type ViewType = 'list' | 'calendar'

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'long',
  }).format(new Date(date))
}

function formatFullDate(date: Date): string {
  return new Intl.DateTimeFormat('ro-RO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function getEventIcon(type: string) {
  switch (type) {
    case 'VACATION':
      return Sun
    case 'HOLIDAY':
      return Leaf
    case 'SEMESTER_START':
    case 'SEMESTER_END':
      return CalendarIcon
    case 'LAST_DAY':
      return TreePine
    case 'PROMO':
      return Megaphone
    default:
      return CalendarIcon
  }
}

function getEventIconColor(type: string) {
  switch (type) {
    case 'VACATION':
      return 'text-amber-600'
    case 'HOLIDAY':
      return 'text-rose-600'
    case 'SEMESTER_START':
      return 'text-emerald-600'
    case 'SEMESTER_END':
    case 'LAST_DAY':
      return 'text-violet-600'
    case 'PROMO':
      return 'text-blue-600'
    default:
      return 'text-slate-600'
  }
}

function getEventBorderColor(type: string) {
  switch (type) {
    case 'VACATION':
      return 'border-amber-200'
    case 'HOLIDAY':
      return 'border-rose-200'
    case 'SEMESTER_START':
      return 'border-emerald-200'
    case 'SEMESTER_END':
    case 'LAST_DAY':
      return 'border-violet-200'
    case 'PROMO':
      return 'border-blue-200'
    default:
      return 'border-slate-200'
  }
}

function getEventTextColor(type: string) {
  return 'text-slate-900'
}

function getEventColor(type: string) {
  switch (type) {
    case 'VACATION':
      return 'bg-amber-200 border-amber-200'
    case 'HOLIDAY':
      return 'bg-rose-200 border-rose-200'
    case 'SEMESTER_START':
      return 'bg-emerald-200 border-emerald-200'
    case 'SEMESTER_END':
    case 'LAST_DAY':
      return 'bg-violet-200 border-violet-200'
    case 'PROMO':
      return 'bg-blue-200 border-blue-200'
    default:
      return 'bg-white border-slate-200'
  }
}

function getEventLabel(type: string) {
  switch (type) {
    case 'VACATION':
      return 'Vacanță'
    case 'HOLIDAY':
      return 'Zi liberă'
    case 'SEMESTER_START':
      return 'Început semestru'
    case 'SEMESTER_END':
      return 'Sfârșit semestru'
    case 'LAST_DAY':
      return 'Ultima zi'
    case 'PROMO':
      return 'Promoție'
    default:
      return 'Eveniment'
  }
}

function getEventForDate(
  date: Date,
  allEvents: Array<{
    id: string
    startDate: Date
    endDate: Date | null
    type: string
    title: string
    description?: string | null
  }>
): {
  id: string
  startDate: Date
  endDate: Date | null
  type: string
  title: string
  description?: string | null
} | null {
  const dateStr = date.toDateString()
  for (const event of allEvents) {
    const start = new Date(event.startDate)
    const end = event.endDate ? new Date(event.endDate) : start
    const current = new Date(start)
    while (current <= end) {
      if (current.toDateString() === dateStr) {
        return event
      }
      current.setDate(current.getDate() + 1)
    }
  }
  return null
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // Monday = 0
}

function getDayName(date: Date): string {
  return new Intl.DateTimeFormat('ro-RO', {
    weekday: 'short',
  }).format(date)
}

function CalendarDay({ 
  day, 
  date, 
  event, 
  isToday, 
  getEventColor,
  isCurrentMonth = true,
  showCalendarDayNumbers = false
}: {
  day: number
  date: Date
  event: {
    id: string
    startDate: Date
    endDate: Date | null
    type: string
    title: string
    description?: string | null
  } | null
  isToday: boolean
  getEventColor: (type: string) => string
  isCurrentMonth?: boolean
  showCalendarDayNumbers?: boolean
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  
  const colorClasses = event ? getEventColor(event.type) : ''
  const borderColor = colorClasses.includes('border-amber') ? 'border-amber-200'
    : colorClasses.includes('border-rose') ? 'border-rose-200'
    : colorClasses.includes('border-emerald') ? 'border-emerald-200'
    : colorClasses.includes('border-violet') ? 'border-violet-200'
    : 'border-slate-200'
  
  const bgColor = colorClasses.includes('border-amber') ? 'bg-amber-200' 
    : colorClasses.includes('border-rose') ? 'bg-rose-200'
    : colorClasses.includes('border-emerald') ? 'bg-emerald-200'
    : colorClasses.includes('border-violet') ? 'bg-violet-200'
    : isToday ? 'bg-blue-200' : 'bg-white'
  
  // Nu afișăm zilele din alte luni
  if (!isCurrentMonth) {
    return <div className="w-full h-10" />
  }

  const textColor = colorClasses.includes('text-amber') ? 'text-amber-700 font-medium'
    : colorClasses.includes('text-rose') ? 'text-rose-700 font-medium'
    : colorClasses.includes('text-emerald') ? 'text-emerald-700 font-medium'
    : colorClasses.includes('text-violet') ? 'text-violet-700 font-medium'
    : isToday ? 'text-blue-700 font-bold' : 'text-slate-900 font-normal'

  const dayName = showCalendarDayNumbers ? getDayName(date) : null
  const EventIcon = event ? getEventIcon(event.type) : null
  const iconColor = event ? getEventIconColor(event.type) : ''

  if (!event) {
    return (
      <div
        className={`w-full ${showCalendarDayNumbers ? 'h-16' : 'h-10'} flex items-center justify-center text-sm rounded-md border ${bgColor} ${borderColor} ${textColor} ${isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''} transition-colors`}
      >
        {showCalendarDayNumbers ? (
          <div className="text-lg font-bold">{day}</div>
        ) : (
          day
        )}
      </div>
    )
  }

  return (
    <div 
      className="relative group w-full"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(!showTooltip)}
    >
      <div
        className={`w-full ${showCalendarDayNumbers ? 'h-16' : 'h-10'} flex items-center justify-center text-sm rounded-md border ${bgColor} ${borderColor} ${textColor} ${isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''} cursor-pointer hover:shadow-lg hover:scale-105 transition-all`}
      >
        {showCalendarDayNumbers ? (
          <div className="text-lg font-bold">{day}</div>
        ) : (
          EventIcon ? (
            <EventIcon className={`h-5 w-5 ${iconColor}`} />
          ) : (
            day
          )
        )}
      </div>
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap max-w-xs pointer-events-none">
          <div className="font-semibold mb-1">{event.title}</div>
          {event.description && (
            <div className="text-slate-300 text-[11px] whitespace-normal max-w-[200px]">
              {event.description}
            </div>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-slate-900 rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  )
}

function MonthCalendar({ 
  year, 
  month, 
  monthName,
  allEvents,
  getEventColor,
  showCalendarDayNumbers = false
}: { 
  year: number
  month: number
  monthName: string
  allEvents: Array<{
    id: string
    startDate: Date
    endDate: Date | null
    type: string
    title: string
    description?: string | null
  }>
  getEventColor: (type: string) => string
  showCalendarDayNumbers?: boolean
}) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
  const today = new Date()
  
  // Calculate days from previous month
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)
  
  const days: Array<{ day: number; date: Date; isCurrentMonth: boolean }> = []
  
  // Add days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const date = new Date(prevYear, prevMonth, day)
    days.push({ day, date, isCurrentMonth: false })
  }
  
  // Add days from current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    days.push({ day, date, isCurrentMonth: true })
  }
  
  // Add days from next month to complete the grid (up to 6 weeks = 42 days)
  const remainingDays = 42 - days.length
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(nextYear, nextMonth, day)
    days.push({ day, date, isCurrentMonth: false })
  }

  // Limit to necessary weeks
  const weeksToShow = Math.ceil((daysInMonth + firstDay) / 7)
  const totalDays = weeksToShow * 7
  const daysToShow = days.slice(0, totalDays)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h4 className="mb-4 text-center text-base font-bold text-slate-900">
        {monthName} {year}
      </h4>
      <div className="flex flex-col gap-1">
        {/* Header row */}
        <div className="flex gap-1">
          {weekDays.map((day, idx) => (
            <div 
              key={`${day}-${idx}`} 
              className="flex-1 text-center text-xs font-bold text-slate-600 py-1 uppercase"
            >
              {day}
            </div>
          ))}
        </div>
        {/* Calendar rows */}
        {Array.from({ length: weeksToShow }, (_, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
            {daysToShow.slice(weekIndex * 7, (weekIndex + 1) * 7).map(({ day, date, isCurrentMonth }, index) => {
              const event = getEventForDate(date, allEvents)
              const isToday = 
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
              
              return (
                <div key={`${date.getTime()}-${index}`} className="flex-1">
                  <CalendarDay
                    day={day}
                    date={date}
                    event={event}
                    isToday={isToday}
                    getEventColor={getEventColor}
                    isCurrentMonth={isCurrentMonth}
                    showCalendarDayNumbers={showCalendarDayNumbers}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function CalendarView({ 
  allEvents, 
  schoolYear,
  getEventColor,
  showCalendarDayNumbers = false
}: { 
  allEvents: Array<{
    id: string
    startDate: Date
    endDate: Date | null
    type: string
    title: string
    description?: string | null
  }>
  schoolYear: string
  getEventColor: (type: string) => string
  showCalendarDayNumbers?: boolean
}) {
  const [startYear, endYear] = schoolYear.split('-').map(Number)
  
  const months = [
    { name: 'Septembrie', year: startYear, month: 8 },
    { name: 'Octombrie', year: startYear, month: 9 },
    { name: 'Noiembrie', year: startYear, month: 10 },
    { name: 'Decembrie', year: startYear, month: 11 },
    { name: 'Ianuarie', year: endYear, month: 0 },
    { name: 'Februarie', year: endYear, month: 1 },
    { name: 'Martie', year: endYear, month: 2 },
    { name: 'Aprilie', year: endYear, month: 3 },
    { name: 'Mai', year: endYear, month: 4 },
    { name: 'Iunie', year: endYear, month: 5 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {months.map(({ name, year, month }, index) => (
        <MonthCalendar
          key={`${year}-${month}-${index}`}
          year={year}
          month={month}
          monthName={name}
          allEvents={allEvents}
          getEventColor={getEventColor}
          showCalendarDayNumbers={showCalendarDayNumbers}
        />
      ))}
    </div>
  )
}

export function CountyCalendar({ county, events, promos = [], schoolYear, showCalendarDayNumbers = false }: CountyCalendarProps) {
  const [view, setView] = useState<ViewType>('list')

  // Convert promos to event-like structure for unified display
  const promoEvents = promos.map(promo => ({
    id: promo.id,
    title: `📢 ${promo.title}`,
    description: promo.description,
    startDate: new Date(promo.startDate),
    endDate: new Date(promo.endDate),
    type: 'PROMO' as const,
    imageUrl: promo.imageUrl,
    backgroundColor: promo.backgroundColor,
    link: promo.link,
    active: true,
    isPromo: true,
  }))

  // Combine county-specific vacation with common events
  const allEvents = [
    // Add promos
    ...promoEvents,
    // Add the intersemester vacation specific to this county
    ...(county.group?.periods.map((period) => ({
      id: period.id,
      title: `Vacanța intersemestrială - ${county.group?.name}`,
      startDate: new Date(period.startDate),
      endDate: period.endDate ? new Date(period.endDate) : null,
      type: 'VACATION' as const,
      description: `Vacanța intersemestrială pentru ${county.name} (${county.group?.name})`,
      isCountySpecific: true,
    })) || []),
    // Add common events
    ...events.map((e) => ({ 
      ...e, 
      startDate: new Date(e.startDate),
      endDate: e.endDate ? new Date(e.endDate) : null,
      isCountySpecific: false 
    })),
  ].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm lg:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 lg:text-3xl">
            Calendarul Anului Școlar {schoolYear}
          </h2>
          <p className="mt-2 text-slate-600">
            Toate evenimentele importante pentru județul {county.name}
          </p>
        </div>
        <div className="flex justify-center lg:inline-flex lg:items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
            className="gap-2 rounded-md shrink-0 m-0"
          >
            <List className="h-4 w-4" />
            Listă
          </Button>
          <Button
            variant={view === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('calendar')}
            className="gap-2 rounded-md shrink-0 m-0"
          >
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </Button>
        </div>
      </div>

      {view === 'list' ? (
        <>
          <div className="space-y-4">
            {allEvents.map((event, index) => {
              const EventIcon = getEventIcon(event.type)
              const iconColor = getEventIconColor(event.type)
              const borderColor = getEventBorderColor(event.type)
              const textColor = getEventTextColor(event.type)
              const eventDate = new Date(event.startDate)
              const dayName = showCalendarDayNumbers ? getDayName(eventDate) : null
              const dayNumber = showCalendarDayNumbers ? eventDate.getDate() : null
              
              return (
                <article 
                  key={event.id}
                  className={`relative rounded-xl p-4 transition-all hover:shadow-md overflow-hidden bg-white border-2 ${borderColor} ${'isCountySpecific' in event && event.isCountySpecific ? 'ring-2 ring-offset-2' : ''}`}
                  style={{
                    ...('isCountySpecific' in event && event.isCountySpecific 
                      ? { ['--tw-ring-color' as string]: county.group?.color } 
                      : {}),
                  } as React.CSSProperties}
                >
                  <div className="relative flex items-center gap-4 z-10">
                    <div
                      className="flex flex-col items-center justify-center shrink-0 rounded-md bg-white"
                      style={{
                        aspectRatio: '1 / 1',
                        width: showCalendarDayNumbers ? '4rem' : '4rem',
                        height: showCalendarDayNumbers ? '4rem' : '4rem',
                        minWidth: '5rem',
                        minHeight: '5rem',
                      }}
                    >
                      {showCalendarDayNumbers ? (
                        <>
                          <div className="text-[11px] font-semibold uppercase leading-tight opacity-80">
                            {eventDate.toLocaleString('ro-RO', { month: 'short' })}
                          </div>
                          <div className="text-4xl font-bold leading-none">
                            {dayNumber}
                          </div>
                          <div className="text-[11px] font-medium capitalize leading-tight opacity-70">
                            {eventDate.toLocaleString('ro-RO', { weekday: 'long' })}
                          </div>
                        </>
                      ) : (
                        <EventIcon className={`h-6 w-6 ${iconColor}`} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium uppercase tracking-wider opacity-75 ${textColor}`}>
                          {getEventLabel(event.type)}
                        </span>
                        {'isCountySpecific' in event && event.isCountySpecific && (
                          <span 
                            className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                            style={{ backgroundColor: county.group?.color }}
                          >
                            {county.name}
                          </span>
                        )}
                      </div>
                      
                      <h3 className={`font-semibold ${textColor}`}>
                        {event.title}
                      </h3>
                      
                      <p className={`mt-1 text-sm opacity-90 ${textColor}`}>
                        {event.endDate 
                          ? `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`
                          : formatFullDate(event.startDate)
                        }
                      </p>
                      
                      {event.description && (
                        <p className={`mt-2 text-sm opacity-75 ${textColor}`}>
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 rounded-xl bg-slate-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Legendă</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { type: 'VACATION', label: 'Vacanță' },
                { type: 'HOLIDAY', label: 'Zi liberă' },
                { type: 'SEMESTER_START', label: 'Început' },
                { type: 'LAST_DAY', label: 'Sfârșit' },
              ].map(({ type, label }) => (
                <span 
                  key={type}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getEventColor(type)}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Legend */}
          <div className="mb-6 rounded-xl bg-slate-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Legendă</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { type: 'VACATION', label: 'Vacanță' },
                { type: 'HOLIDAY', label: 'Zi liberă' },
                { type: 'SEMESTER_START', label: 'Început semestru' },
                { type: 'LAST_DAY', label: 'Sfârșit' },
              ].map(({ type, label }) => (
                <span 
                  key={type}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getEventColor(type)}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <CalendarView 
            allEvents={allEvents.map(e => ({
              ...e,
              description: 'description' in e ? e.description : null
            }))} 
            schoolYear={schoolYear}
            getEventColor={getEventColor}
            showCalendarDayNumbers={showCalendarDayNumbers}
          />
        </>
      )}
    </section>
  )
}

