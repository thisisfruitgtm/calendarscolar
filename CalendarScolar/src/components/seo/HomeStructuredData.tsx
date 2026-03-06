export function HomeStructuredData() {
  const baseUrl = 'https://calendarscolar.ro'

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CalendarȘcolar.ro',
    url: baseUrl,
    description:
      'Calendar școlar complet pentru toate cele 42 de județe. Vacanțe, zile libere, structura anului școlar 2025-2026 și 2026-2027.',
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
    name: 'CalendarȘcolar.ro – Calendar Școlar 2025-2026 și 2026-2027',
    description:
      'Calendar școlar complet pentru toate cele 42 de județe. Vacanțe, zile libere, structura anului școlar 2025-2026 și 2026-2027.',
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

  // Key school calendar events for structured data (both 2025-2026 remaining + 2026-2027)
  const eventsSchema = [
    // 2025-2026 remaining events (current school year)
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Vacanța de primăvară 2026',
      startDate: '2026-04-11',
      endDate: '2026-04-21',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Country', name: 'România' },
      organizer: { '@type': 'Organization', name: 'Ministerul Educației' },
      description: 'Vacanța de Paște 2026 pentru toți elevii din România (anul școlar 2025-2026).',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Sfârșitul anului școlar 2025-2026',
      startDate: '2026-06-19',
      endDate: '2026-06-19',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Country', name: 'România' },
      organizer: { '@type': 'Organization', name: 'Ministerul Educației' },
      description: 'Ultima zi de cursuri pentru anul școlar 2025-2026. Vacanța de vară începe pe 20 iunie 2026.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Vacanța de vară 2026',
      startDate: '2026-06-20',
      endDate: '2026-09-06',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Country', name: 'România' },
      organizer: { '@type': 'Organization', name: 'Ministerul Educației' },
      description: 'Vacanța de vară 2026 pentru toți elevii din România.',
    },
    // 2026-2027 events
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Început an școlar 2026-2027',
      startDate: '2026-09-07',
      endDate: '2026-09-07',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Country', name: 'România' },
      organizer: { '@type': 'Organization', name: 'Ministerul Educației' },
      description: 'Prima zi de școală pentru anul școlar 2026-2027. Cursuri: 7 septembrie 2026 – 18 iunie 2027.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Vacanța de iarnă 2026-2027',
      startDate: '2026-12-20',
      endDate: '2027-01-05',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Country', name: 'România' },
      organizer: { '@type': 'Organization', name: 'Ministerul Educației' },
      description: 'Vacanța de Crăciun și Anul Nou pentru toți elevii din România.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Vacanța intersemestrială 2027',
      startDate: '2027-02-15',
      endDate: '2027-03-07',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Country', name: 'România' },
      organizer: { '@type': 'Organization', name: 'Ministerul Educației' },
      description: 'Vacanța intersemestrială organizată în 3 grupe: Grupa A (15-21 feb), Grupa B (22-28 feb), Grupa C (1-7 mar).',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Vacanța de primăvară 2027',
      startDate: '2027-04-19',
      endDate: '2027-05-03',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Country', name: 'România' },
      organizer: { '@type': 'Organization', name: 'Ministerul Educației' },
      description: 'Vacanța de Paște pentru toți elevii din România, include Paștele Ortodox.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Vacanța de vară 2027',
      startDate: '2027-06-19',
      endDate: '2027-09-05',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Country', name: 'România' },
      organizer: { '@type': 'Organization', name: 'Ministerul Educației' },
      description: 'Vacanța de vară 2027 pentru toți elevii din România.',
    },
  ]

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
      {eventsSchema.map((event, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
        />
      ))}
    </>
  )
}
