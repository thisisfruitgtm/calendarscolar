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
          Calendar Școlar {schoolYear}
        </Text>
        <Text style={styles.separator}>—</Text>
        <Text style={styles.county}>
          Județul {countyName}
        </Text>
        {groupName && (
          <>
            <View style={[styles.groupBadge, { backgroundColor: groupColor }]}>
              <Text style={styles.groupText}>{groupName}</Text>
            </View>
            <Text style={styles.groupInfo}>Vacanța intersemestrială</Text>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: PDF_COLORS.BRAND_BLUE,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  brand: {
    fontSize: 8,
    fontWeight: 900,
    color: PDF_COLORS.BRAND_BLUE,
  },
  separator: {
    fontSize: 8,
    color: PDF_COLORS.TEXT_MUTED,
  },
  title: {
    fontSize: 11,
    fontWeight: 900,
    color: PDF_COLORS.TEXT_PRIMARY,
  },
  county: {
    fontSize: 11,
    fontWeight: 600,
    color: PDF_COLORS.TEXT_PRIMARY,
  },
  groupBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
    marginLeft: 2,
  },
  groupText: {
    fontSize: 5.5,
    fontWeight: 600,
    color: PDF_COLORS.WHITE,
  },
  groupInfo: {
    fontSize: 5.5,
    color: PDF_COLORS.TEXT_MUTED,
  },
})
