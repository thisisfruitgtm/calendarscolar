'use client'

import { useState, useMemo } from 'react'
import { Event, Promo } from '@prisma/client'
import { Calendar as CalendarIcon, Sun, Leaf, TreePine, List, ChevronLeft, ChevronRight, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FadeInUp } from '@/components/ui/fade-in-up'

type PromoWithoutCounties = Omit<Promo, 'counties'>

interface LandingCalendarProps {
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
    case 'PROMO':
      return Megaphone
    case 'LAST_DAY':
      return TreePine
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

function getLegendColor(type: string) {
  switch (type) {
    case 'VACATION':
      return 'bg-white border-amber-200'
    case 'HOLIDAY':
      return 'bg-white border-rose-200'
    case 'SEMESTER_START':
      return 'bg-white border-emerald-200'
    case 'SEMESTER_END':
    case 'LAST_DAY':
      return 'bg-white border-violet-200'
    case 'PROMO':
      return 'bg-white border-blue-200'
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
  
  if (!isCurrentMonth) {
    return <div className="w-full h-10" />
  }

  const textColor = colorClasses.includes('text-amber') ? 'text-amber-700 font-medium'
    : colorClasses.includes('text-rose') ? 'text-rose-700 font-medium'
    : colorClasses.includes('text-emerald') ? 'text-emerald-700 font-medium'
    : colorClasses.includes('text-violet') ? 'text-violet-700 font-medium'
    : isToday ? 'text-blue-700 font-bold' : 'text-slate-900 font-normal'

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
  
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)
  
  const days: Array<{ day: number; date: Date; isCurrentMonth: boolean }> = []
  
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const date = new Date(prevYear, prevMonth, day)
    days.push({ day, date, isCurrentMonth: false })
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    days.push({ day, date, isCurrentMonth: true })
  }
  
  const remainingDays = 42 - days.length
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(nextYear, nextMonth, day)
    days.push({ day, date, isCurrentMonth: false })
  }

  const weeksToShow = Math.ceil((daysInMonth + firstDay) / 7)
  const totalDays = weeksToShow * 7
  const daysToShow = days.slice(0, totalDays)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-1">
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
  showCalendarDayNumbers = false,
  currentMonthIndex,
  onMonthChange
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
  currentMonthIndex: number
  onMonthChange: (index: number) => void
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

  const currentMonth = months[currentMonthIndex]
  const canGoPrevious = currentMonthIndex > 0
  const canGoNext = currentMonthIndex < months.length - 1

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMonthChange(currentMonthIndex - 1)}
          disabled={!canGoPrevious}
          className="shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-lg font-semibold text-slate-900 min-w-[200px] text-center">
          {currentMonth.name} {currentMonth.year}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMonthChange(currentMonthIndex + 1)}
          disabled={!canGoNext}
          className="shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Single Month Calendar */}
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <MonthCalendar
            year={currentMonth.year}
            month={currentMonth.month}
            monthName={currentMonth.name}
            allEvents={allEvents}
            getEventColor={getEventColor}
            showCalendarDayNumbers={showCalendarDayNumbers}
          />
        </div>
      </div>
    </div>
  )
}

export function LandingCalendar({ events, promos = [], schoolYear, showCalendarDayNumbers = false }: LandingCalendarProps) {
  const [view, setView] = useState<ViewType>('list')
  
  // Calculate current month index based on today's date
  const [startYear, endYear] = schoolYear.split('-').map(Number)
  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth() // 0-11
  
  // Find current month index or default to 0
  const currentMonthIndexFromDate = useMemo(() => {
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
    const index = months.findIndex(m => 
      m.year === todayYear && m.month === todayMonth
    )
    return index >= 0 ? index : 0
  }, [startYear, endYear, todayYear, todayMonth])
  
  const [currentMonthIndex, setCurrentMonthIndex] = useState(currentMonthIndexFromDate)

  // Convert promos to event-like structure
  const promoEvents = promos.map(promo => ({
    id: promo.id,
    title: `📢 ${promo.title}`,
    description: promo.description,
    startDate: new Date(promo.startDate),
    endDate: new Date(promo.endDate),
    type: 'PROMO' as const,
    imageUrl: promo.imageUrl,
    backgroundColor: promo.backgroundColor,
    active: true,
    countyId: null,
    createdAt: promo.createdAt,
    updatedAt: promo.updatedAt,
  }))

  // Filter events to show only future ones (from today onwards)
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  todayStart.setHours(0, 0, 0, 0)

  const allEvents = [
    ...promoEvents,
    ...events.map((e) => ({ 
      ...e, 
      startDate: new Date(e.startDate),
      endDate: e.endDate ? new Date(e.endDate) : null,
    })),
  ]
    .filter((event) => {
      // Keep event if it ends today or later
      const eventEndDate = event.endDate || event.startDate
      const eventEnd = new Date(eventEndDate)
      eventEnd.setHours(23, 59, 59, 999)
      return eventEnd >= todayStart
    })
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 6) // Show only first 6 events on landing page

  return (
    <FadeInUp delay={1200} duration={700}>
      <section className="rounded-2xl bg-white p-6 shadow-sm lg:p-8 relative z-20 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between relative z-30">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 lg:text-3xl">
              Calendarul Anului Școlar {schoolYear}
            </h2>
            <p className="mt-2 text-slate-600">
              Toate evenimentele importante pentru anul școlar
            </p>
          </div>
        <div className="flex justify-center lg:inline-flex lg:items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5 relative z-40">
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
            className="gap-2 rounded-md shrink-0 m-0 relative z-50"
            type="button"
          >
            <List className="h-4 w-4" />
            Listă
          </Button>
          <Button
            variant={view === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('calendar')}
            className="gap-2 rounded-md shrink-0 m-0 relative z-50"
            type="button"
          >
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </Button>
        </div>
      </div>

      {view === 'list' ? (
        <>
          <div className="mb-6 max-w-4xl mx-auto">
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
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getLegendColor(type)}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          
          <div className="space-y-4 max-w-4xl mx-auto max-h-[500px] overflow-y-auto">
            {allEvents.map((event) => {
              const EventIcon = getEventIcon(event.type)
              const iconColor = getEventIconColor(event.type)
              const borderColor = getEventBorderColor(event.type)
              const textColor = getEventTextColor(event.type)
              const eventDate = new Date(event.startDate)
              const dayNumber = showCalendarDayNumbers ? eventDate.getDate() : null
              
              return (
                <article 
                  key={event.id}
                  className={`relative rounded-xl p-4 transition-all hover:shadow-md overflow-hidden bg-white border-2 ${borderColor}`}
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
        </>
      ) : (
        <>
          <div className="mb-6">
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
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getLegendColor(type)}`}
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
            currentMonthIndex={currentMonthIndex}
            onMonthChange={setCurrentMonthIndex}
          />
        </>
      )}
      </section>
    </FadeInUp>
  )
}

