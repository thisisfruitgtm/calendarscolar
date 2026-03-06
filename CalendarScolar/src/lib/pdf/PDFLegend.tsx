import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { PDF_COLORS } from './colors'

const LEGEND_ITEMS = [
  { label: 'Vacanță', color: PDF_COLORS.VACATION },
  { label: 'Zi liberă', color: PDF_COLORS.HOLIDAY },
  { label: 'Început semestru', color: PDF_COLORS.SEMESTER_START },
  { label: 'Sfârșit semestru / ultima zi', color: PDF_COLORS.LAST_DAY },
]

export function PDFLegend() {
  return (
    <View style={styles.container}>
      <View style={styles.legendRow}>
        {LEGEND_ITEMS.map((item, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: PDF_COLORS.WEEKEND_BG, borderWidth: 0.5, borderColor: PDF_COLORS.BORDER }]} />
          <Text style={styles.legendText}>Weekend</Text>
        </View>
      </View>
      <Text style={styles.branding}>calendarscolar.ro</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: PDF_COLORS.BORDER,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  swatch: {
    width: 8,
    height: 8,
    borderRadius: 1.5,
  },
  legendText: {
    fontSize: 6,
    color: PDF_COLORS.TEXT_SECONDARY,
  },
  branding: {
    fontSize: 7,
    fontWeight: 600,
    color: PDF_COLORS.TEXT_MUTED,
  },
})
