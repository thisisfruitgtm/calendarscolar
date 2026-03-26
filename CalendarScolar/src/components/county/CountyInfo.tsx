import { County, VacationGroup, VacationPeriod, Event, EventType } from '@prisma/client'
import { Map, FileDown } from 'lucide-react'
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

const COUNTY_REGIONS: Record<string, string> = {
  'alba': 'Transilvania',
  'arad': 'Crișana',
  'arges': 'Muntenia',
  'bacau': 'Moldova',
  'bihor': 'Crișana',
  'bistrita-nasaud': 'Transilvania',
  'botosani': 'Moldova',
  'braila': 'Muntenia',
  'brasov': 'Transilvania',
  'bucuresti': 'Muntenia',
  'buzau': 'Muntenia',
  'calarasi': 'Muntenia',
  'caras-severin': 'Banat',
  'cluj': 'Transilvania',
  'constanta': 'Dobrogea',
  'covasna': 'Transilvania',
  'dambovita': 'Muntenia',
  'dolj': 'Oltenia',
  'galati': 'Moldova',
  'giurgiu': 'Muntenia',
  'gorj': 'Oltenia',
  'harghita': 'Transilvania',
  'hunedoara': 'Transilvania',
  'ialomita': 'Muntenia',
  'iasi': 'Moldova',
  'ilfov': 'Muntenia',
  'maramures': 'Maramureș',
  'mehedinti': 'Oltenia',
  'mures': 'Transilvania',
  'neamt': 'Moldova',
  'olt': 'Oltenia',
  'prahova': 'Muntenia',
  'salaj': 'Transilvania',
  'satu-mare': 'Crișana',
  'sibiu': 'Transilvania',
  'suceava': 'Bucovina',
  'teleorman': 'Muntenia',
  'timis': 'Banat',
  'tulcea': 'Dobrogea',
  'valcea': 'Oltenia',
  'vaslui': 'Moldova',
  'vrancea': 'Moldova',
}

const COUNTY_NEIGHBORS: Record<string, { name: string; slug: string }[]> = {
  'alba': [
    { name: 'Cluj', slug: 'cluj' },
    { name: 'Mureș', slug: 'mures' },
    { name: 'Sibiu', slug: 'sibiu' },
    { name: 'Hunedoara', slug: 'hunedoara' },
    { name: 'Arad', slug: 'arad' },
  ],
  'arad': [
    { name: 'Timiș', slug: 'timis' },
    { name: 'Bihor', slug: 'bihor' },
    { name: 'Hunedoara', slug: 'hunedoara' },
    { name: 'Alba', slug: 'alba' },
  ],
  'arges': [
    { name: 'Vâlcea', slug: 'valcea' },
    { name: 'Dâmbovița', slug: 'dambovita' },
    { name: 'Prahova', slug: 'prahova' },
    { name: 'Sibiu', slug: 'sibiu' },
    { name: 'Olt', slug: 'olt' },
  ],
  'bacau': [
    { name: 'Neamț', slug: 'neamt' },
    { name: 'Vrancea', slug: 'vrancea' },
    { name: 'Harghita', slug: 'harghita' },
    { name: 'Vaslui', slug: 'vaslui' },
    { name: 'Covasna', slug: 'covasna' },
  ],
  'bihor': [
    { name: 'Satu Mare', slug: 'satu-mare' },
    { name: 'Sălaj', slug: 'salaj' },
    { name: 'Cluj', slug: 'cluj' },
    { name: 'Arad', slug: 'arad' },
  ],
  'bistrita-nasaud': [
    { name: 'Maramureș', slug: 'maramures' },
    { name: 'Cluj', slug: 'cluj' },
    { name: 'Mureș', slug: 'mures' },
    { name: 'Suceava', slug: 'suceava' },
  ],
  'botosani': [
    { name: 'Suceava', slug: 'suceava' },
    { name: 'Iași', slug: 'iasi' },
    { name: 'Neamț', slug: 'neamt' },
  ],
  'braila': [
    { name: 'Galați', slug: 'galati' },
    { name: 'Buzău', slug: 'buzau' },
    { name: 'Ialomița', slug: 'ialomita' },
    { name: 'Vrancea', slug: 'vrancea' },
    { name: 'Tulcea', slug: 'tulcea' },
  ],
  'brasov': [
    { name: 'Covasna', slug: 'covasna' },
    { name: 'Harghita', slug: 'harghita' },
    { name: 'Mureș', slug: 'mures' },
    { name: 'Sibiu', slug: 'sibiu' },
    { name: 'Prahova', slug: 'prahova' },
    { name: 'Dâmbovița', slug: 'dambovita' },
  ],
  'bucuresti': [
    { name: 'Ilfov', slug: 'ilfov' },
  ],
  'buzau': [
    { name: 'Brăila', slug: 'braila' },
    { name: 'Vrancea', slug: 'vrancea' },
    { name: 'Prahova', slug: 'prahova' },
    { name: 'Ialomița', slug: 'ialomita' },
    { name: 'Covasna', slug: 'covasna' },
  ],
  'calarasi': [
    { name: 'Ialomița', slug: 'ialomita' },
    { name: 'Giurgiu', slug: 'giurgiu' },
    { name: 'Constanța', slug: 'constanta' },
    { name: 'Ilfov', slug: 'ilfov' },
  ],
  'caras-severin': [
    { name: 'Timiș', slug: 'timis' },
    { name: 'Hunedoara', slug: 'hunedoara' },
    { name: 'Gorj', slug: 'gorj' },
    { name: 'Mehedinți', slug: 'mehedinti' },
  ],
  'cluj': [
    { name: 'Bihor', slug: 'bihor' },
    { name: 'Sălaj', slug: 'salaj' },
    { name: 'Bistrița-Năsăud', slug: 'bistrita-nasaud' },
    { name: 'Mureș', slug: 'mures' },
    { name: 'Alba', slug: 'alba' },
    { name: 'Maramureș', slug: 'maramures' },
  ],
  'constanta': [
    { name: 'Tulcea', slug: 'tulcea' },
    { name: 'Ialomița', slug: 'ialomita' },
    { name: 'Călărași', slug: 'calarasi' },
  ],
  'covasna': [
    { name: 'Harghita', slug: 'harghita' },
    { name: 'Brașov', slug: 'brasov' },
    { name: 'Vrancea', slug: 'vrancea' },
    { name: 'Bacău', slug: 'bacau' },
    { name: 'Mureș', slug: 'mures' },
  ],
  'dambovita': [
    { name: 'Argeș', slug: 'arges' },
    { name: 'Prahova', slug: 'prahova' },
    { name: 'Ilfov', slug: 'ilfov' },
    { name: 'Giurgiu', slug: 'giurgiu' },
    { name: 'Brașov', slug: 'brasov' },
  ],
  'dolj': [
    { name: 'Mehedinți', slug: 'mehedinti' },
    { name: 'Gorj', slug: 'gorj' },
    { name: 'Olt', slug: 'olt' },
  ],
  'galati': [
    { name: 'Brăila', slug: 'braila' },
    { name: 'Vrancea', slug: 'vrancea' },
    { name: 'Vaslui', slug: 'vaslui' },
    { name: 'Tulcea', slug: 'tulcea' },
  ],
  'giurgiu': [
    { name: 'Ilfov', slug: 'ilfov' },
    { name: 'Dâmbovița', slug: 'dambovita' },
    { name: 'Argeș', slug: 'arges' },
    { name: 'Teleorman', slug: 'teleorman' },
    { name: 'Călărași', slug: 'calarasi' },
  ],
  'gorj': [
    { name: 'Mehedinți', slug: 'mehedinti' },
    { name: 'Dolj', slug: 'dolj' },
    { name: 'Vâlcea', slug: 'valcea' },
    { name: 'Hunedoara', slug: 'hunedoara' },
    { name: 'Caraș-Severin', slug: 'caras-severin' },
  ],
  'harghita': [
    { name: 'Mureș', slug: 'mures' },
    { name: 'Covasna', slug: 'covasna' },
    { name: 'Brașov', slug: 'brasov' },
    { name: 'Bacău', slug: 'bacau' },
    { name: 'Neamț', slug: 'neamt' },
  ],
  'hunedoara': [
    { name: 'Arad', slug: 'arad' },
    { name: 'Timiș', slug: 'timis' },
    { name: 'Caraș-Severin', slug: 'caras-severin' },
    { name: 'Gorj', slug: 'gorj' },
    { name: 'Sibiu', slug: 'sibiu' },
    { name: 'Alba', slug: 'alba' },
  ],
  'ialomita': [
    { name: 'Prahova', slug: 'prahova' },
    { name: 'Buzău', slug: 'buzau' },
    { name: 'Brăila', slug: 'braila' },
    { name: 'Constanța', slug: 'constanta' },
    { name: 'Călărași', slug: 'calarasi' },
    { name: 'Ilfov', slug: 'ilfov' },
  ],
  'iasi': [
    { name: 'Botoșani', slug: 'botosani' },
    { name: 'Neamț', slug: 'neamt' },
    { name: 'Vaslui', slug: 'vaslui' },
  ],
  'ilfov': [
    { name: 'București', slug: 'bucuresti' },
    { name: 'Prahova', slug: 'prahova' },
    { name: 'Dâmbovița', slug: 'dambovita' },
    { name: 'Giurgiu', slug: 'giurgiu' },
    { name: 'Ialomița', slug: 'ialomita' },
    { name: 'Călărași', slug: 'calarasi' },
  ],
  'maramures': [
    { name: 'Satu Mare', slug: 'satu-mare' },
    { name: 'Sălaj', slug: 'salaj' },
    { name: 'Cluj', slug: 'cluj' },
    { name: 'Bistrița-Năsăud', slug: 'bistrita-nasaud' },
  ],
  'mehedinti': [
    { name: 'Caraș-Severin', slug: 'caras-severin' },
    { name: 'Gorj', slug: 'gorj' },
    { name: 'Dolj', slug: 'dolj' },
  ],
  'mures': [
    { name: 'Bistrița-Năsăud', slug: 'bistrita-nasaud' },
    { name: 'Cluj', slug: 'cluj' },
    { name: 'Harghita', slug: 'harghita' },
    { name: 'Brașov', slug: 'brasov' },
    { name: 'Sibiu', slug: 'sibiu' },
    { name: 'Alba', slug: 'alba' },
  ],
  'neamt': [
    { name: 'Suceava', slug: 'suceava' },
    { name: 'Bacău', slug: 'bacau' },
    { name: 'Iași', slug: 'iasi' },
    { name: 'Harghita', slug: 'harghita' },
  ],
  'olt': [
    { name: 'Dolj', slug: 'dolj' },
    { name: 'Vâlcea', slug: 'valcea' },
    { name: 'Argeș', slug: 'arges' },
    { name: 'Teleorman', slug: 'teleorman' },
    { name: 'Giurgiu', slug: 'giurgiu' },
  ],
  'prahova': [
    { name: 'Argeș', slug: 'arges' },
    { name: 'Dâmbovița', slug: 'dambovita' },
    { name: 'Brașov', slug: 'brasov' },
    { name: 'Buzău', slug: 'buzau' },
    { name: 'Ialomița', slug: 'ialomita' },
  ],
  'salaj': [
    { name: 'Bihor', slug: 'bihor' },
    { name: 'Satu Mare', slug: 'satu-mare' },
    { name: 'Maramureș', slug: 'maramures' },
    { name: 'Cluj', slug: 'cluj' },
  ],
  'satu-mare': [
    { name: 'Bihor', slug: 'bihor' },
    { name: 'Sălaj', slug: 'salaj' },
    { name: 'Maramureș', slug: 'maramures' },
  ],
  'sibiu': [
    { name: 'Alba', slug: 'alba' },
    { name: 'Hunedoara', slug: 'hunedoara' },
    { name: 'Brașov', slug: 'brasov' },
    { name: 'Mureș', slug: 'mures' },
    { name: 'Vâlcea', slug: 'valcea' },
    { name: 'Argeș', slug: 'arges' },
  ],
  'suceava': [
    { name: 'Botoșani', slug: 'botosani' },
    { name: 'Neamț', slug: 'neamt' },
    { name: 'Bistrița-Năsăud', slug: 'bistrita-nasaud' },
    { name: 'Maramureș', slug: 'maramures' },
  ],
  'teleorman': [
    { name: 'Giurgiu', slug: 'giurgiu' },
    { name: 'Argeș', slug: 'arges' },
    { name: 'Olt', slug: 'olt' },
    { name: 'Dâmbovița', slug: 'dambovita' },
  ],
  'timis': [
    { name: 'Arad', slug: 'arad' },
    { name: 'Caraș-Severin', slug: 'caras-severin' },
    { name: 'Hunedoara', slug: 'hunedoara' },
  ],
  'tulcea': [
    { name: 'Constanța', slug: 'constanta' },
    { name: 'Brăila', slug: 'braila' },
    { name: 'Galați', slug: 'galati' },
  ],
  'valcea': [
    { name: 'Gorj', slug: 'gorj' },
    { name: 'Olt', slug: 'olt' },
    { name: 'Argeș', slug: 'arges' },
    { name: 'Sibiu', slug: 'sibiu' },
  ],
  'vaslui': [
    { name: 'Iași', slug: 'iasi' },
    { name: 'Bacău', slug: 'bacau' },
    { name: 'Vrancea', slug: 'vrancea' },
    { name: 'Galați', slug: 'galati' },
  ],
  'vrancea': [
    { name: 'Covasna', slug: 'covasna' },
    { name: 'Bacău', slug: 'bacau' },
    { name: 'Buzău', slug: 'buzau' },
    { name: 'Brăila', slug: 'braila' },
    { name: 'Galați', slug: 'galati' },
    { name: 'Vaslui', slug: 'vaslui' },
  ],
}

function getRelatedCounties(slug: string): { name: string; slug: string }[] {
  return COUNTY_NEIGHBORS[slug] || []
}

function generateFAQ(county: CountyWithGroup, events: Event[]) {
  const faqs: Array<{ question: string; answer: string }> = []
  const region = COUNTY_REGIONS[county.slug] || 'România'

  // FAQ 1: Când începe școala în 2026?
  const semesterStart = events.find(e => e.type === EventType.SEMESTER_START)
  if (semesterStart) {
    faqs.push({
      question: `Când începe școala în ${county.name} în 2026?`,
      answer: `Școala începe în județul ${county.name} pe ${formatDate(semesterStart.startDate)}, conform structurii anului școlar 2026-2027 aprobate prin Ordinul nr. 3.194/2026 al Ministerului Educației.`
    })
  }

  // FAQ 2: Când se termină anul școlar?
  const semesterEnd = events.find(e => e.type === EventType.SEMESTER_END)
  if (semesterEnd) {
    faqs.push({
      question: `Când se termină anul școlar 2026-2027 în ${county.name}?`,
      answer: `Anul școlar 2026-2027 se termină în județul ${county.name} pe ${formatDate(semesterEnd.startDate)}. După această dată începe vacanța de vară 2027.`
    })
  }

  // FAQ 3: Ce grupă de vacanță intersemestrială are județul?
  const intersemesterVacation = county.group?.periods.find(p => p.type === 'INTERSEMESTER')
  if (intersemesterVacation && county.group) {
    faqs.push({
      question: `Ce grupă de vacanță intersemestrială are județul ${county.name}?`,
      answer: `Județul ${county.name} face parte din ${county.group.name} pentru vacanța intersemestrială 2027, programată în perioada ${formatDate(intersemesterVacation.startDate)} – ${formatDate(intersemesterVacation.endDate)}. Sistemul celor trei grupe (A, B, C) a fost introdus pentru a evita supraaglomerarea în stațiunile montane și pe căile ferate în aceeași perioadă.`
    })
  }

  // FAQ 4: Care sunt vacanțele școlare 2026-2027?
  const vacations = events.filter(e => e.type === EventType.VACATION && e.active)
  if (vacations.length > 0) {
    const vacationList = vacations
      .map(v => `${v.title} (${formatDate(v.startDate)}${v.endDate ? ` – ${formatDate(v.endDate)}` : ''})`)
      .join('; ')
    faqs.push({
      question: `Care sunt vacanțele școlare 2026-2027 în județul ${county.name}?`,
      answer: `Vacanțele școlare 2026-2027 pentru județul ${county.name} din ${region} sunt: ${vacationList}.`
    })
  }

  // FAQ 5: Care sunt zilele libere legale?
  const holidays = events.filter(e => e.type === EventType.HOLIDAY && e.active)
  if (holidays.length > 0) {
    const holidayList = holidays
      .slice(0, 6)
      .map(h => `${h.title} (${formatDate(h.startDate)})`)
      .join(', ')
    faqs.push({
      question: `Care sunt zilele libere legale în ${county.name} în anul școlar 2026-2027?`,
      answer: `Zilele libere legale în care nu se face școală în ${county.name} includ: ${holidayList}.`
    })
  }

  // FAQ 6: Cum descarc calendarul școlar?
  faqs.push({
    question: `Cum descarc sau sincronizez calendarul școlar pentru ${county.name}?`,
    answer: `Poți descărca calendarul școlar ${county.name} 2026-2027 în format PDF (toate cele 12 luni pe o singură pagină A4) folosind butonul "Descarcă PDF" din această pagină. Alternativ, folosește butonul "Adaugă în calendar" pentru a sincroniza automat toate vacanțele și zilele libere în Google Calendar, Apple Calendar sau Outlook. Calendarul se actualizează automat la orice modificare oficială.`
  })

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

      {/* PDF Download */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Calendar printabil
        </h2>
        <p className="mb-4 text-sm text-slate-600">
          Descarcă calendarul școlar {county.name} în format PDF — toate cele 12 luni
          ale anului școlar 2026-2027 pe o singură pagină A4 landscape,
          cu vacanțele și zilele libere marcate color.
        </p>
        <a
          href={`/api/calendar/county/${county.slug}/pdf`}
          download
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90 shadow-sm hover:shadow-md"
        >
          <FileDown className="h-4 w-4" />
          Descarcă PDF
        </a>
      </section>

      {/* SEO Content */}
      <section className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Calendar Școlar {county.name} 2026-2027
        </h2>
        
        {(() => {
          const region = COUNTY_REGIONS[county.slug] || 'România'
          const intersemesterPeriod = county.group?.periods.find(p => p.type === 'INTERSEMESTER')
          return (
            <div className="space-y-3 text-sm text-slate-600">
              <p>
                Calendarul școlar pentru județul {county.name}, din regiunea istorică {region},
                acoperă integral structura anului școlar 2026-2027 conform Ordinului nr. 3.194/2026.
                Reședința de județ este {county.capitalCity}, unde se află principalele instituții
                de învățământ preuniversitar din zonă.
              </p>
              {county.group && intersemesterPeriod && (
                <p>
                  Județul {county.name} face parte din {county.group.name} pentru vacanța
                  intersemestrială 2027, programată în perioada{' '}
                  {formatDate(intersemesterPeriod.startDate)} – {formatDate(intersemesterPeriod.endDate)}.
                  Această grupare diferențiată asigură distribuirea uniformă a elevilor
                  în stațiunile de schi și pe căile ferate în luna februarie–martie 2027.
                </p>
              )}
              <p>
                Descarcă calendarul {county.name} în format PDF sau sincronizează-l direct
                în Google Calendar, Apple Calendar ori Outlook pentru a fi mereu la curent
                cu vacanțele școlare și zilele libere legale din 2026-2027.
              </p>
            </div>
          )
        })()}
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

