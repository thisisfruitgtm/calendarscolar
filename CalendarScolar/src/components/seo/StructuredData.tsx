import { County, VacationGroup, VacationPeriod, Event } from '@prisma/client'

type CountyWithGroup = County & {
  group: (VacationGroup & { periods: VacationPeriod[] }) | null
}

interface StructuredDataProps {
  county: CountyWithGroup
  events: Event[]
}

export function StructuredData({ county, events }: StructuredDataProps) {
  const baseUrl = 'https://calendarscolar.ro'
  
  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Acasă',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Județe',
        item: `${baseUrl}/judete`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: county.name,
        item: `${baseUrl}/judet/${county.slug}`,
      },
    ],
  }

  // WebPage schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Calendar Școlar ${county.name} 2025-2026`,
    description: county.metaDescription,
    url: `${baseUrl}/judet/${county.slug}`,
    inLanguage: 'ro-RO',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Calendar Școlar România',
      url: baseUrl,
    },
    about: {
      '@type': 'Place',
      name: county.name,
      address: {
        '@type': 'PostalAddress',
        addressRegion: county.name,
        addressCountry: 'RO',
      },
    },
  }

  // Events schema
  const eventsSchema = events.slice(0, 5).map((event) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: new Date(event.startDate).toISOString().split('T')[0],
    endDate: event.endDate 
      ? new Date(event.endDate).toISOString().split('T')[0]
      : new Date(event.startDate).toISOString().split('T')[0],
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: county.name,
      address: {
        '@type': 'PostalAddress',
        addressRegion: county.name,
        addressLocality: county.capitalCity,
        addressCountry: 'RO',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Ministerul Educației',
      url: 'https://edu.ro',
    },
  }))

  // County-specific vacation event
  const countyVacationSchema = county.group?.periods.map((period) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `Vacanța intersemestrială ${county.name}`,
    description: `Vacanța de februarie pentru județul ${county.name} (${county.group?.name})`,
    startDate: new Date(period.startDate).toISOString().split('T')[0],
    endDate: new Date(period.endDate).toISOString().split('T')[0],
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: county.name,
      address: {
        '@type': 'PostalAddress',
        addressRegion: county.name,
        addressCountry: 'RO',
      },
    },
  })) || []

  // Organization schema for the website
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Calendar Școlar România',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Platformă completă pentru calendar școlar oficial cu sincronizare automată prin format ICS pentru toate cele 42 de județe + București.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Romanian',
    },
  }

  // HowTo schema for subscribing to calendar
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Cum să te abonezi la calendarul școlar ${county.name}`,
    description: `Instrucțiuni pas cu pas pentru abonarea la calendarul școlar pentru județul ${county.name}`,
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Accesează pagina județului',
        text: `Navighează la pagina calendarului școlar pentru județul ${county.name}.`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Apasă butonul "Adaugă în calendar"',
        text: 'Găsește și apasă butonul "Adaugă în calendar" de pe pagină.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Alege aplicația ta de calendar',
        text: 'Selectează aplicația ta preferată: Google Calendar, Apple Calendar sau Outlook.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Confirmă abonarea',
        text: 'Confirmă abonarea în aplicația ta de calendar. Calendarul se va actualiza automat când apar modificări.',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {eventsSchema.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {countyVacationSchema.map((schema, index) => (
        <script
          key={`vacation-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </>
  )
}

