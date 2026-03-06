export function HomeStructuredData() {
  const baseUrl = 'https://calendarscolar.ro'

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CalendarȘcolar.ro',
    url: baseUrl,
    description:
      'Calendar școlar complet pentru toate cele 42 de județe. Vacanțe, zile libere, structura anului școlar 2026-2027.',
    inLanguage: 'ro-RO',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/judete`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CalendarȘcolar.ro',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'Platformă completă pentru calendar școlar oficial cu sincronizare automată prin format ICS pentru toate cele 42 de județe + București.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Romanian',
      url: `${baseUrl}/contact`,
    },
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'CalendarȘcolar.ro – Calendar Școlar 2026-2027',
    description:
      'Calendar școlar complet pentru toate cele 42 de județe. Vacanțe, zile libere, structura anului școlar 2026-2027.',
    url: baseUrl,
    inLanguage: 'ro-RO',
    isPartOf: {
      '@type': 'WebSite',
      name: 'CalendarȘcolar.ro',
      url: baseUrl,
    },
    about: {
      '@type': 'Thing',
      name: 'Anul școlar 2026-2027 România',
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Județe cu calendar școlar',
      numberOfItems: 42,
      itemListElement: [
        'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud',
        'Botoșani', 'Brăila', 'Brașov', 'București', 'Buzău',
        'Călărași', 'Caraș-Severin', 'Cluj', 'Constanța', 'Covasna',
        'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu', 'Gorj', 'Harghita',
        'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
        'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Sălaj',
        'Satu Mare', 'Sibiu', 'Suceava', 'Teleorman', 'Timiș',
        'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea',
      ].map((name, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name,
        url: `${baseUrl}/judet/${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[ăâ]/g, (c: string) => c === 'ă' ? 'a' : 'a').replace(/[îș]/g, (c: string) => c === 'î' ? 'i' : 's').replace(/ț/g, 't').replace(/\s+/g, '-')}`,
      })),
    },
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Cum să adaugi calendarul școlar în telefonul tău',
    description:
      'Instrucțiuni simple pentru sincronizarea calendarului școlar 2026-2027 în Google Calendar, Apple Calendar sau Outlook.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Alege județul',
        text: 'Selectează județul tău din lista celor 42 de județe.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Apasă „Adaugă în calendar"',
        text: 'Pe pagina județului, apasă butonul „Adaugă în calendar".',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Alege aplicația',
        text: 'Selectează Google Calendar, Apple Calendar sau Outlook.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Gata!',
        text: 'Calendarul se sincronizează automat și primești actualizări când apar modificări.',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </>
  )
}
