import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { PDF_COLORS } from './colors'

interface PDFHeaderProps {
  countyName: string
  groupName: string | null
  groupColor: string
  schoolYear: string
}

export function PDFHeader({ countyName, groupName, groupColor, schoolYear }: PDFHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.brand}>CalendarScolar.ro</Text>
        <Text style={styles.separator}>|</Text>
        <Text style={styles.title}>
          Calendar Scolar {schoolYear}
        </Text>
        <Text style={styles.separator}>—</Text>
        <Text style={styles.county}>
          Judetul {countyName}
        </Text>
      </View>
      {groupName && (
        <View style={styles.groupRow}>
          <View style={[styles.groupBadge, { backgroundColor: groupColor }]}>
            <Text style={styles.groupText}>{groupName}</Text>
          </View>
          <Text style={styles.groupInfo}>Vacanta intersemestriala</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: PDF_COLORS.BRAND_BLUE,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brand: {
    fontSize: 9,
    fontWeight: 900,
    color: PDF_COLORS.BRAND_BLUE,
  },
  separator: {
    fontSize: 9,
    color: PDF_COLORS.TEXT_MUTED,
  },
  title: {
    fontSize: 12,
    fontWeight: 900,
    color: PDF_COLORS.TEXT_PRIMARY,
  },
  county: {
    fontSize: 12,
    fontWeight: 600,
    color: PDF_COLORS.TEXT_PRIMARY,
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  groupBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 3,
  },
  groupText: {
    fontSize: 6,
    fontWeight: 600,
    color: PDF_COLORS.WHITE,
  },
  groupInfo: {
    fontSize: 6,
    color: PDF_COLORS.TEXT_MUTED,
  },
})
