import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { PDFEvent } from './calendar-utils'
import { PDF_COLORS, getEventBgColor } from './colors'

interface PDFEventsListProps {
  events: PDFEvent[]
  schoolYear: string
}

interface EventGroup {
  title: string
  type: string
  events: PDFEvent[]
}

function formatDateShort(date: Date): string {
  const d = new Date(date)
  const day = d.getDate()
  const months = [
    'ian', 'feb', 'mar', 'apr', 'mai', 'iun',
    'iul', 'aug', 'sep', 'oct', 'nov', 'dec',
  ]
  return `${day} ${months[d.getMonth()]}`
}

function formatDateRange(event: PDFEvent): string {
  const start = formatDateShort(event.startDate)
  if (!event.endDate) return start
  const s = new Date(event.startDate)
  const e = new Date(event.endDate)
  if (s.getTime() === e.getTime()) return start
  return `${start} – ${formatDateShort(event.endDate)}`
}

function filterToSchoolYear(events: PDFEvent[], schoolYear: string): PDFEvent[] {
  const [startYear, endYear] = schoolYear.split('-').map(Number)
  const rangeStart = new Date(startYear, 8, 1) // 1 Sept
  const rangeEnd = new Date(endYear, 7, 31)    // 31 Aug
  return events.filter((e) => {
    const s = new Date(e.startDate)
    return s >= rangeStart && s <= rangeEnd
  })
}

function groupEvents(events: PDFEvent[]): EventGroup[] {
  const groups: EventGroup[] = [
    { title: 'Vacanțe', type: 'VACATION', events: [] },
    { title: 'Zile libere', type: 'HOLIDAY', events: [] },
    { title: 'Structură an școlar', type: 'STRUCTURE', events: [] },
  ]

  const sorted = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )

  for (const event of sorted) {
    switch (event.type) {
      case 'VACATION':
        groups[0].events.push(event)
        break
      case 'HOLIDAY':
        groups[1].events.push(event)
        break
      case 'SEMESTER_START':
      case 'SEMESTER_END':
      case 'LAST_DAY':
        groups[2].events.push(event)
        break
    }
  }

  return groups.filter((g) => g.events.length > 0)
}

export function PDFEventsList({ events, schoolYear }: PDFEventsListProps) {
  const filtered = filterToSchoolYear(events, schoolYear)
  const groups = groupEvents(filtered)

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Evenimente</Text>

      {groups.map((group, gi) => (
        <View key={gi} style={styles.group}>
          <View style={styles.groupHeader}>
            <View
              style={[
                styles.groupDot,
                {
                  backgroundColor:
                    group.type === 'VACATION'
                      ? PDF_COLORS.VACATION
                      : group.type === 'HOLIDAY'
                        ? PDF_COLORS.HOLIDAY
                        : PDF_COLORS.SEMESTER_START,
                },
              ]}
            />
            <Text style={styles.groupTitle}>{group.title}</Text>
          </View>

          {group.events.map((event, ei) => {
            const bgColor = getEventBgColor(event.type)
            return (
              <View key={ei} style={styles.eventRow}>
                <View
                  style={[
                    styles.eventDot,
                    { backgroundColor: bgColor || PDF_COLORS.BORDER },
                  ]}
                />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>
                    {formatDateRange(event)}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
      ))}

      {/* Legend at bottom */}
      <View style={styles.legendSection}>
        <Text style={styles.legendTitle}>Legendă</Text>
        <View style={styles.legendGrid}>
          {[
            { label: 'Vacanță', color: PDF_COLORS.VACATION },
            { label: 'Zi liberă', color: PDF_COLORS.HOLIDAY },
            { label: 'Început sem.', color: PDF_COLORS.SEMESTER_START },
            { label: 'Sfârșit / ultima zi', color: PDF_COLORS.LAST_DAY },
            { label: 'Weekend', color: PDF_COLORS.WEEKEND_BG, border: true },
          ].map((item, i) => (
            <View key={i} style={styles.legendItem}>
              <View
                style={[
                  styles.legendSwatch,
                  { backgroundColor: item.color },
                  item.border
                    ? { borderWidth: 0.5, borderColor: PDF_COLORS.BORDER }
                    : {},
                ]}
              />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 165,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: PDF_COLORS.BORDER,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: 900,
    color: PDF_COLORS.BRAND_BLUE,
    marginBottom: 5,
  },
  group: {
    marginBottom: 4,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2,
  },
  groupDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  groupTitle: {
    fontSize: 6,
    fontWeight: 600,
    color: PDF_COLORS.TEXT_PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 3,
    paddingLeft: 8,
    marginBottom: 1.5,
  },
  eventDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginTop: 1.5,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 5,
    fontWeight: 600,
    color: PDF_COLORS.TEXT_PRIMARY,
    lineHeight: 1.2,
  },
  eventDate: {
    fontSize: 4.5,
    color: PDF_COLORS.TEXT_SECONDARY,
  },
  legendSection: {
    marginTop: 'auto' as unknown as number,
    paddingTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: PDF_COLORS.BORDER,
  },
  legendTitle: {
    fontSize: 5,
    fontWeight: 600,
    color: PDF_COLORS.TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  legendGrid: {
    gap: 1.5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  legendSwatch: {
    width: 6,
    height: 6,
    borderRadius: 1,
  },
  legendText: {
    fontSize: 5,
    color: PDF_COLORS.TEXT_SECONDARY,
  },
})
