export const PDF_COLORS = {
  // Event type backgrounds (day cell fill)
  VACATION: '#FDE68A',       // amber-200
  HOLIDAY: '#FECACA',        // rose-200
  SEMESTER_START: '#A7F3D0', // emerald-200
  SEMESTER_END: '#DDD6FE',   // violet-200
  LAST_DAY: '#DDD6FE',      // violet-200

  // Structural
  TEXT_PRIMARY: '#0F172A',   // slate-900
  TEXT_SECONDARY: '#475569', // slate-600
  TEXT_MUTED: '#94A3B8',     // slate-400
  BORDER: '#E2E8F0',        // slate-200
  WEEKEND_BG: '#F8FAFC',    // slate-50
  WHITE: '#FFFFFF',
  DAY_HEADER_TEXT: '#64748B', // slate-500

  // Brand
  BRAND_BLUE: '#1E40AF',    // blue-800
} as const

export function getEventBgColor(type: string): string | null {
  switch (type) {
    case 'VACATION': return PDF_COLORS.VACATION
    case 'HOLIDAY': return PDF_COLORS.HOLIDAY
    case 'SEMESTER_START': return PDF_COLORS.SEMESTER_START
    case 'SEMESTER_END':
    case 'LAST_DAY': return PDF_COLORS.LAST_DAY
    default: return null
  }
}
