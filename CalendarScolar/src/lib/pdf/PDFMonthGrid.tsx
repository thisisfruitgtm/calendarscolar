import { View, Text, StyleSheet } from '@react-pdf/renderer'
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getEventForDate,
  WEEKDAY_HEADERS,
  PDFEvent,
} from './calendar-utils'
import { PDF_COLORS, getEventBgColor } from './colors'

interface PDFMonthGridProps {
  year: number
  month: number
  monthName: string
  events: PDFEvent[]
}

export function PDFMonthGrid({ year, month, monthName, events }: PDFMonthGridProps) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const weeksNeeded = Math.ceil((daysInMonth + firstDay) / 7)

  // Build cells: null for empty, number for day
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <View style={styles.container}>
      {/* Month name with underline accent */}
      <View style={styles.monthHeader}>
        <Text style={styles.monthName}>{monthName}</Text>
        <Text style={styles.monthYear}> {year}</Text>
      </View>

      {/* Weekday headers */}
      <View style={styles.weekRow}>
        {WEEKDAY_HEADERS.map((day, i) => (
          <View key={i} style={styles.headerCell}>
            <Text style={[
              styles.headerText,
              (i === 5 || i === 6) ? styles.weekendHeader : {},
            ]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Week rows */}
      {Array.from({ length: weeksNeeded }, (_, weekIdx) => (
        <View key={weekIdx} style={styles.weekRow}>
          {cells.slice(weekIdx * 7, (weekIdx + 1) * 7).map((day, dayIdx) => {
            if (day === null) {
              return <View key={dayIdx} style={styles.dayCell} />
            }

            const date = new Date(year, month, day)
            const event = getEventForDate(date, events)
            const isWeekend = dayIdx === 5 || dayIdx === 6
            const eventBg = event ? getEventBgColor(event.type) : null

            const cellStyle = [
              styles.dayCell,
              eventBg ? { backgroundColor: eventBg, borderRadius: 2 } : {},
              !eventBg && isWeekend ? { backgroundColor: PDF_COLORS.WEEKEND_BG } : {},
            ]

            const textStyle = [
              styles.dayText,
              event ? styles.eventDayText : {},
              isWeekend && !event ? styles.weekendText : {},
            ]

            return (
              <View key={dayIdx} style={cellStyle}>
                <Text style={textStyle}>{day}</Text>
              </View>
            )
          })}
        </View>
      ))}

      {/* Pad empty rows so all months have same height (6 rows max) */}
      {Array.from({ length: 6 - weeksNeeded }, (_, i) => (
        <View key={`pad-${i}`} style={styles.weekRow}>
          {Array.from({ length: 7 }, (_, j) => (
            <View key={j} style={styles.dayCell} />
          ))}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 3,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: PDF_COLORS.BRAND_BLUE,
  },
  monthName: {
    fontSize: 7,
    fontWeight: 900,
    color: PDF_COLORS.BRAND_BLUE,
  },
  monthYear: {
    fontSize: 6,
    fontWeight: 400,
    color: PDF_COLORS.TEXT_MUTED,
  },
  weekRow: {
    flexDirection: 'row',
    gap: 0.5,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 0.5,
  },
  headerText: {
    fontSize: 4.5,
    fontWeight: 600,
    color: PDF_COLORS.DAY_HEADER_TEXT,
  },
  weekendHeader: {
    color: PDF_COLORS.TEXT_MUTED,
  },
  dayCell: {
    flex: 1,
    height: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 6.5,
    fontWeight: 400,
    color: PDF_COLORS.TEXT_PRIMARY,
  },
  eventDayText: {
    fontWeight: 600,
  },
  weekendText: {
    color: PDF_COLORS.TEXT_MUTED,
  },
})
