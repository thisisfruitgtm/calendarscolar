import { Document, Page, View, StyleSheet } from '@react-pdf/renderer'
import './fonts' // Side-effect: registers Inter font
import { PDFHeader } from './PDFHeader'
import { PDFMonthGrid } from './PDFMonthGrid'
import { PDFLegend } from './PDFLegend'
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

  // Split into 3 rows of 4 months
  const rows = [
    months.slice(0, 4),
    months.slice(4, 8),
    months.slice(8, 12),
  ]

  return (
    <Document
      title={`Calendar Scolar ${schoolYear} — Judetul ${countyName}`}
      author="CalendarScolar.ro"
      subject={`Calendarul scolar complet pentru judetul ${countyName}, an scolar ${schoolYear}`}
      creator="CalendarScolar.ro"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <PDFHeader
          countyName={countyName}
          groupName={groupName}
          groupColor={groupColor}
          schoolYear={schoolYear}
        />

        {/* 3 rows × 4 months */}
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

        <PDFLegend />
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Inter',
    backgroundColor: PDF_COLORS.WHITE,
  },
  monthRow: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
})
