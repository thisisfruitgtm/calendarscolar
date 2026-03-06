export interface PDFEvent {
  id: string
  startDate: Date
  endDate: Date | null
  type: string
  title: string
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/** Returns 0=Monday ... 6=Sunday */
export function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export function getEventForDate(
  date: Date,
  events: PDFEvent[]
): PDFEvent | null {
  const dateStr = date.toDateString()
  for (const event of events) {
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

export const WEEKDAY_HEADERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function getSchoolYearMonths(schoolYear: string) {
  const [startYear, endYear] = schoolYear.split('-').map(Number)
  return [
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
    { name: 'Iulie', year: endYear, month: 6 },
    { name: 'August', year: endYear, month: 7 },
  ]
}
