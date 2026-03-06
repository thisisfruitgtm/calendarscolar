import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sugestii și Feedback - CalendarȘcolar.ro',
  description: 'Trimite sugestii și feedback pentru CalendarȘcolar.ro. Ajută-ne să îmbunătățim platforma de calendar școlar 2026-2027 pentru toți părinții și elevii din România.',
  openGraph: {
    title: 'Sugestii și Feedback - CalendarȘcolar.ro',
    description: 'Ajută-ne să îmbunătățim CalendarȘcolar.ro cu sugestiile tale.',
    type: 'website',
    locale: 'ro_RO',
  },
  alternates: {
    canonical: 'https://calendarscolar.ro/sugestii',
  },
}

export default function SugestiiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
