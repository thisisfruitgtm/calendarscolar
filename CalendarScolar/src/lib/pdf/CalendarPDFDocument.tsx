import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import './fonts' // Side-effect: registers Inter font
import { PDFHeader } from './PDFHeader'
import { PDFMonthGrid } from './PDFMonthGrid'
import { PDFEventsList } from './PDFEventsList'
import { getSchoolYearMonths, PDFEvent } from './calendar-utils'
import { PDF_COLORS } from './colors'

interface CalendarPDFDocumentProps {
  countyName: string
  groupName: string | null
  groupColor: string
  schoolYear: string
  events: PDFEvent[]
}

export function CalendarPDFDocument({
  countyName,
  groupName,
  groupColor,
  schoolYear,
  events,
}: CalendarPDFDocumentProps) {
  const months = getSchoolYearMonths(schoolYear)

  // 3 rows × 4 months
  const rows = [
    months.slice(0, 4),
    months.slice(4, 8),
    months.slice(8, 12),
  ]

  return (
    <Document
      title={`Calendar Școlar ${schoolYear} — Județul ${countyName}`}
      author="CalendarȘcolar.ro"
      subject={`Calendarul școlar complet pentru județul ${countyName}, an școlar ${schoolYear}`}
      creator="CalendarScolar.ro"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <PDFHeader
          countyName={countyName}
          groupName={groupName}
          groupColor={groupColor}
          schoolYear={schoolYear}
        />

        {/* 2-column layout: events list | calendar grid */}
        <View style={styles.body}>
          {/* Left column: events + legend */}
          <PDFEventsList events={events} schoolYear={schoolYear} />

          {/* Right column: 3 rows × 4 months */}
          <View style={styles.calendarGrid}>
            {rows.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.monthRow}>
                {row.map((m, colIdx) => (
                  <PDFMonthGrid
                    key={colIdx}
                    year={m.year}
                    month={m.month}
                    monthName={m.name}
                    events={events}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>calendarscolar.ro</Text>
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: {
    padding: 16,
    fontFamily: 'Inter',
    backgroundColor: PDF_COLORS.WHITE,
  },
  body: {
    flexDirection: 'row',
    flex: 1,
    gap: 8,
  },
  calendarGrid: {
    flex: 1,
    gap: 4,
  },
  monthRow: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  footer: {
    fontSize: 6,
    fontWeight: 600,
    color: PDF_COLORS.TEXT_MUTED,
    textAlign: 'right',
    marginTop: 3,
  },
})
