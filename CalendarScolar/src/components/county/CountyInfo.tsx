import { County, VacationGroup, VacationPeriod, Event, EventType } from '@prisma/client'
import { Map } from 'lucide-react'
import Link from 'next/link'
import { CountyActions } from './CountyActions'

type CountyWithGroup = County & {
  group: (VacationGroup & { periods: VacationPeriod[] }) | null
}

interface CountyInfoProps {
  county: CountyWithGroup & { id: string }
  events: Event[]
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

// Get neighboring counties for internal linking
function getRelatedCounties(slug: string): { name: string; slug: string }[] {
  const neighbors: Record<string, { name: string; slug: string }[]> = {
    'timis': [
      { name: 'Arad', slug: 'arad' },
      { name: 'Caraș-Severin', slug: 'caras-severin' },
      { name: 'Hunedoara', slug: 'hunedoara' },
    ],
    'bucuresti': [
      { name: 'Ilfov', slug: 'ilfov' },
      { name: 'Giurgiu', slug: 'giurgiu' },
      { name: 'Călărași', slug: 'calarasi' },
    ],
    'cluj': [
      { name: 'Bihor', slug: 'bihor' },
      { name: 'Sălaj', slug: 'salaj' },
      { name: 'Alba', slug: 'alba' },
      { name: 'Mureș', slug: 'mures' },
    ],
    'iasi': [
      { name: 'Botoșani', slug: 'botosani' },
      { name: 'Suceava', slug: 'suceava' },
      { name: 'Neamț', slug: 'neamt' },
      { name: 'Vaslui', slug: 'vaslui' },
    ],
  }
  
  return neighbors[slug] || []
}

function generateFAQ(county: CountyWithGroup, events: Event[]) {
  const faqs: Array<{ question: string; answer: string }> = []
  
  // FAQ 1: Când începe anul școlar?
  const semesterStart = events.find(e => e.type === EventType.SEMESTER_START)
  if (semesterStart) {
    faqs.push({
      question: `Când începe anul școlar ${county.name}?`,
      answer: `Anul școlar pentru județul ${county.name} începe pe ${formatDate(semesterStart.startDate)}.`
    })
  }

  // FAQ 2: Când este vacanța intersemestrială?
  const intersemesterVacation = county.group?.periods.find(p => p.type === 'INTERSEMESTER')
  if (intersemesterVacation) {
    faqs.push({
      question: `Când este vacanța intersemestrială ${county.name}?`,
      answer: `Vacanța intersemestrială pentru județul ${county.name} (${county.group?.name}) este în perioada ${formatDate(intersemesterVacation.startDate)} - ${formatDate(intersemesterVacation.endDate)}.`
    })
  }

  // FAQ 3: Care sunt vacanțele principale?
  const vacations = events.filter(e => e.type === EventType.VACATION && e.active)
  if (vacations.length > 0) {
    const vacationList = vacations
      .slice(0, 3)
      .map(v => `${v.title} (${formatDate(v.startDate)}${v.endDate ? ` - ${formatDate(v.endDate)}` : ''})`)
      .join(', ')
    faqs.push({
      question: `Care sunt vacanțele principale pentru ${county.name}?`,
      answer: `Principalele vacanțe pentru județul ${county.name} sunt: ${vacationList}.`
    })
  }

  // FAQ 4: Cum pot să mă abonez la calendar?
  faqs.push({
    question: `Cum pot să mă abonez la calendarul școlar ${county.name}?`,
    answer: `Poți să te abonezi la calendarul școlar pentru ${county.name} folosind butonul "Adaugă în calendar" și alegând aplicația ta preferată (Google Calendar, Apple Calendar sau Outlook). Abonarea la calendar îți permite să ai toate vacanțele și zilele libere direct în aplicația ta de calendar. Calendarul se actualizează automat când apar modificări, astfel încât să ai întotdeauna informațiile cele mai actualizate.`
  })

  // FAQ 5: Care sunt zilele libere legale?
  const holidays = events.filter(e => e.type === EventType.HOLIDAY && e.active)
  if (holidays.length > 0) {
    const holidayList = holidays
      .slice(0, 5)
      .map(h => `${h.title} (${formatDate(h.startDate)})`)
      .join(', ')
    faqs.push({
      question: `Care sunt zilele libere legale pentru ${county.name}?`,
      answer: `Zilele libere legale pentru județul ${county.name} includ: ${holidayList}.`
    })
  }

  // FAQ 6: Când se termină anul școlar?
  const semesterEnd = events.find(e => e.type === EventType.SEMESTER_END)
  if (semesterEnd) {
    faqs.push({
      question: `Când se termină anul școlar ${county.name}?`,
      answer: `Anul școlar pentru județul ${county.name} se termină pe ${formatDate(semesterEnd.startDate)}.`
    })
  }

  return faqs
}

function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function CountyInfo({ county, events }: CountyInfoProps) {
  const relatedCounties = getRelatedCounties(county.slug)
  const faqs = generateFAQ(county, events)
  const faqSchema = generateFAQSchema(faqs)

  return (
    <>
      {/* FAQ Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="space-y-6">
      {/* County Group Info */}
      {county.group && (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Informații grupă
          </h2>
          
          <div 
            className="rounded-xl p-4"
            style={{ backgroundColor: `${county.group.color}15` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span 
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: county.group.color }}
              />
              <span className="font-medium text-slate-900">
                {county.group.name}
              </span>
            </div>
            
            <p className="text-sm text-slate-600">
              Județul {county.name} face parte din {county.group.name} pentru 
              vacanța intersemestrială. Aceasta se desfășoară în perioada 
              diferită față de alte grupuri.
            </p>
          </div>
        </section>
      )}

      {/* Related Counties */}
      {relatedCounties.length > 0 && (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Județe învecinate
          </h2>
          
          <div className="space-y-2">
            {relatedCounties.map((related) => (
              <Link
                key={related.slug}
                href={`/judet/${related.slug}`}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition-all hover:border-slate-200 hover:bg-slate-50"
              >
                <Map className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  {related.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SEO Content */}
      <section className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Calendar Școlar {county.name}
        </h2>
        
        <div className="space-y-3 text-sm text-slate-600">
          <p>
            Calendarul școlar pentru județul {county.name} include toate 
            vacanțele și zilele libere pentru anul școlar 2025-2026. 
            Consultă programul complet pentru a planifica activitățile școlare.
          </p>
          
          <p>
            Reședința de județ este {county.capitalCity}, unde se află 
            principalele instituții de învățământ din zonă. Verifică datele 
            exacte ale vacanțelor pentru a evita orice confuzie.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Întrebări Frecvente (FAQ)
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-100 last:border-b-0 pb-4 last:pb-0">
                <h3 className="mb-2 font-semibold text-slate-900">
                  {faq.question}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Counties Link */}
      <Link
        href="/judete"
        className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-4 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
      >
        <Map className="h-4 w-4" />
        Vezi toate județele
      </Link>
    </div>
    </>
  )
}

