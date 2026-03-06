import { PrismaClient, VacationType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Județele grupate conform structurii oficiale MEC 2026-2027
// Săptămâna de vacanță ISJ/ISMB: 15 februarie - 7 martie 2027
const GRUPA_A = { // 15-21 februarie 2027
  name: 'Grupa A',
  color: '#1E40AF', // dark blue
  counties: [
    { name: 'Timiș', slug: 'timis', capitalCity: 'Timișoara', population: 683540 },
    { name: 'Caraș-Severin', slug: 'caras-severin', capitalCity: 'Reșița', population: 267995 },
    { name: 'Gorj', slug: 'gorj', capitalCity: 'Târgu Jiu', population: 323317 },
    { name: 'Mehedinți', slug: 'mehedinti', capitalCity: 'Drobeta-Turnu Severin', population: 254570 },
    { name: 'Dolj', slug: 'dolj', capitalCity: 'Craiova', population: 654368 },
    { name: 'Cluj', slug: 'cluj', capitalCity: 'Cluj-Napoca', population: 736301 },
  ],
  vacation: {
    name: 'Vacanța intersemestrială',
    startDate: new Date('2027-02-15'),
    endDate: new Date('2027-02-21'),
  }
}

const GRUPA_B = { // 22-28 februarie 2027
  name: 'Grupa B',
  color: '#60A5FA', // light blue
  counties: [
    { name: 'Arad', slug: 'arad', capitalCity: 'Arad', population: 409072 },
    { name: 'Bihor', slug: 'bihor', capitalCity: 'Oradea', population: 551297 },
    { name: 'Satu Mare', slug: 'satu-mare', capitalCity: 'Satu Mare', population: 330445 },
    { name: 'Sălaj', slug: 'salaj', capitalCity: 'Zalău', population: 218958 },
    { name: 'Hunedoara', slug: 'hunedoara', capitalCity: 'Deva', population: 382281 },
    { name: 'Alba', slug: 'alba', capitalCity: 'Alba Iulia', population: 323778 },
    { name: 'Sibiu', slug: 'sibiu', capitalCity: 'Sibiu', population: 397322 },
    { name: 'Vâlcea', slug: 'valcea', capitalCity: 'Râmnicu Vâlcea', population: 355320 },
    { name: 'Olt', slug: 'olt', capitalCity: 'Slatina', population: 404567 },
    { name: 'Argeș', slug: 'arges', capitalCity: 'Pitești', population: 570714 },
    { name: 'Teleorman', slug: 'teleorman', capitalCity: 'Alexandria', population: 353599 },
    { name: 'Giurgiu', slug: 'giurgiu', capitalCity: 'Giurgiu', population: 264083 },
    { name: 'Dâmbovița', slug: 'dambovita', capitalCity: 'Târgoviște', population: 491036 },
    { name: 'Prahova', slug: 'prahova', capitalCity: 'Ploiești', population: 721676 },
    { name: 'Brașov', slug: 'brasov', capitalCity: 'Brașov', population: 549217 },
  ],
  vacation: {
    name: 'Vacanța intersemestrială',
    startDate: new Date('2027-02-22'),
    endDate: new Date('2027-02-28'),
  }
}

const GRUPA_C = { // 1-7 martie 2027
  name: 'Grupa C',
  color: '#22C55E', // green
  counties: [
    { name: 'Maramureș', slug: 'maramures', capitalCity: 'Baia Mare', population: 459726 },
    { name: 'Bistrița-Năsăud', slug: 'bistrita-nasaud', capitalCity: 'Bistrița', population: 277861 },
    { name: 'Mureș', slug: 'mures', capitalCity: 'Târgu Mureș', population: 534971 },
    { name: 'Covasna', slug: 'covasna', capitalCity: 'Sfântu Gheorghe', population: 203675 },
    { name: 'Harghita', slug: 'harghita', capitalCity: 'Miercurea Ciuc', population: 302374 },
    { name: 'Suceava', slug: 'suceava', capitalCity: 'Suceava', population: 625437 },
    { name: 'Botoșani', slug: 'botosani', capitalCity: 'Botoșani', population: 386765 },
    { name: 'Iași', slug: 'iasi', capitalCity: 'Iași', population: 792668 },
    { name: 'Neamț', slug: 'neamt', capitalCity: 'Piatra Neamț', population: 451578 },
    { name: 'Bacău', slug: 'bacau', capitalCity: 'Bacău', population: 580345 },
    { name: 'Vaslui', slug: 'vaslui', capitalCity: 'Vaslui', population: 380196 },
    { name: 'Vrancea', slug: 'vrancea', capitalCity: 'Focșani', population: 326146 },
    { name: 'Galați', slug: 'galati', capitalCity: 'Galați', population: 530025 },
    { name: 'Buzău', slug: 'buzau', capitalCity: 'Buzău', population: 427051 },
    { name: 'Brăila', slug: 'braila', capitalCity: 'Brăila', population: 302373 },
    { name: 'Ialomița', slug: 'ialomita', capitalCity: 'Slobozia', population: 258669 },
    { name: 'Călărași', slug: 'calarasi', capitalCity: 'Călărași', population: 284810 },
    { name: 'Constanța', slug: 'constanta', capitalCity: 'Constanța', population: 672972 },
    { name: 'Tulcea', slug: 'tulcea', capitalCity: 'Tulcea', population: 193341 },
    { name: 'Ilfov', slug: 'ilfov', capitalCity: 'Buftea', population: 472418 },
    { name: 'București', slug: 'bucuresti', capitalCity: 'București', population: 1794034 },
  ],
  vacation: {
    name: 'Vacanța intersemestrială',
    startDate: new Date('2027-03-01'),
    endDate: new Date('2027-03-07'),
  }
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.vacationPeriod.deleteMany()
  await prisma.county.deleteMany()
  await prisma.vacationGroup.deleteMany()
  await prisma.event.deleteMany()

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@calendarscolar.ro' },
    update: {},
    create: {
      email: 'admin@calendarscolar.ro',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created')

  // Create settings
  await prisma.settings.upsert({
    where: { id: 'settings' },
    update: {},
    create: {
      id: 'settings',
      calendarName: 'Calendar Școlar 2026-2027',
      schoolYear: '2026-2027',
      adsEnabled: true,
    },
  })
  console.log('✅ Settings created')

  // Create vacation groups and counties
  for (const grupa of [GRUPA_A, GRUPA_B, GRUPA_C]) {
    const group = await prisma.vacationGroup.create({
      data: {
        name: grupa.name,
        color: grupa.color,
      },
    })

    // Create vacation period for this group
    await prisma.vacationPeriod.create({
      data: {
        name: grupa.vacation.name,
        startDate: grupa.vacation.startDate,
        endDate: grupa.vacation.endDate,
        type: VacationType.INTERSEMESTER,
        groupId: group.id,
        schoolYear: '2026-2027',
      },
    })

    // Create counties for this group
    for (const county of grupa.counties) {
      await prisma.county.create({
        data: {
          name: county.name,
          slug: county.slug,
          capitalCity: county.capitalCity,
          population: county.population,
          groupId: group.id,
          metaTitle: `Calendar Școlar ${county.name} 2026-2027 | Vacanțe și Zile Libere`,
          metaDescription: `Calendar școlar complet pentru județul ${county.name} (${county.capitalCity}). Vezi toate vacanțele, zilele libere și structura anului școlar 2026-2027.`,
        },
      })
    }

    console.log(`✅ ${grupa.name} created with ${grupa.counties.length} counties`)
  }

  // Structura anului școlar 2026-2027 conform Ordin Nr. 3.194/2026
  // (Monitorul Oficial Nr. 126/16.II.2026)
  // Cursuri: 7 septembrie 2026 - 18 iunie 2027 (36 săptămâni)
  // Paștele Ortodox: 2 mai 2027
  const commonEvents = [
    // Semestrul I
    {
      title: 'Început an școlar 2026-2027',
      startDate: new Date('2026-09-07'),
      type: 'SEMESTER_START' as const,
      description: 'Prima zi de școală. Cursuri: 7 septembrie 2026 - 18 iunie 2027 (36 săptămâni)',
    },

    // Ziua internațională a educației (Art. 3)
    {
      title: '5 Octombrie - Ziua internațională a educației',
      startDate: new Date('2026-10-05'),
      type: 'HOLIDAY' as const,
      description: 'Ziua internațională a educației - nu se organizează cursuri (conform Art. 3)',
    },

    // Vacanța de toamnă
    {
      title: 'Vacanța de toamnă',
      startDate: new Date('2026-10-24'),
      endDate: new Date('2026-11-01'),
      type: 'VACATION' as const,
      description: 'Vacanța de toamnă (24 octombrie - 1 noiembrie 2026)',
    },

    // Sfântul Andrei
    {
      title: '30 Noiembrie - Sfântul Andrei',
      startDate: new Date('2026-11-30'),
      type: 'HOLIDAY' as const,
      description: 'Sărbătoare legală - zi liberă',
    },

    // Ziua Națională
    {
      title: '1 Decembrie - Ziua Națională',
      startDate: new Date('2026-12-01'),
      type: 'HOLIDAY' as const,
      description: 'Ziua Națională a României - zi liberă',
    },

    // Vacanța de iarnă
    {
      title: 'Vacanța de iarnă',
      startDate: new Date('2026-12-23'),
      endDate: new Date('2027-01-10'),
      type: 'VACATION' as const,
      description: 'Vacanța de Crăciun și Anul Nou (23 decembrie 2026 - 10 ianuarie 2027)',
    },

    // Semestrul II
    {
      title: 'Început semestru II',
      startDate: new Date('2027-01-11'),
      type: 'SEMESTER_START' as const,
      description: 'Reluarea cursurilor după vacanța de iarnă (11 ianuarie 2027)',
    },

    // Unirea Principatelor
    {
      title: '24 Ianuarie - Unirea Principatelor',
      startDate: new Date('2027-01-24'),
      type: 'HOLIDAY' as const,
      description: 'Ziua Unirii Principatelor Române - zi liberă (duminică)',
    },

    // Vacanța de primăvară (include Paștele Ortodox 2 mai 2027)
    {
      title: 'Vacanța de primăvară',
      startDate: new Date('2027-04-24'),
      endDate: new Date('2027-05-04'),
      type: 'VACATION' as const,
      description: 'Vacanța de Paște (24 aprilie - 4 mai 2027, include Paștele Ortodox 2 mai)',
    },

    // 1 Mai (în vacanță)
    {
      title: '1 Mai - Ziua Muncii',
      startDate: new Date('2027-05-01'),
      type: 'HOLIDAY' as const,
      description: 'Ziua Internațională a Muncii - zi liberă (în vacanța de primăvară)',
    },

    // Ziua Copilului
    {
      title: '1 Iunie - Ziua Copilului',
      startDate: new Date('2027-06-01'),
      type: 'HOLIDAY' as const,
      description: 'Ziua Copilului - zi liberă',
    },

    // Ultima zi - clasele XII/XIII (34 săptămâni)
    {
      title: 'Ultima zi - clasele XII/XIII',
      startDate: new Date('2027-06-04'),
      type: 'LAST_DAY' as const,
      description: 'Ultima zi de cursuri pentru elevii claselor a XII-a zi, a XIII-a seral și frecvență redusă (34 săptămâni)',
    },

    // Ultima zi - clasa a VIII-a (35 săptămâni)
    {
      title: 'Ultima zi - clasa a VIII-a',
      startDate: new Date('2027-06-11'),
      type: 'LAST_DAY' as const,
      description: 'Ultima zi de cursuri pentru elevii clasei a VIII-a (35 săptămâni)',
    },

    // Sfârșit an școlar (36 săptămâni)
    {
      title: 'Sfârșit an școlar',
      startDate: new Date('2027-06-18'),
      type: 'LAST_DAY' as const,
      description: 'Ultima zi de școală pentru clasele I-VII și IX-XI (36 săptămâni)',
    },

    // Rusalii (50 zile după Paștele Ortodox 2 mai 2027)
    {
      title: 'Rusalii',
      startDate: new Date('2027-06-20'),
      endDate: new Date('2027-06-21'),
      type: 'HOLIDAY' as const,
      description: 'Rusalii (20-21 iunie 2027) - sărbătoare legală',
    },

    // Ultima zi - liceu tehnologic/profesional (37 săptămâni)
    {
      title: 'Ultima zi - liceu tehnologic/profesional',
      startDate: new Date('2027-06-25'),
      type: 'LAST_DAY' as const,
      description: 'Ultima zi de cursuri pentru clasele din învățământul liceal filiera tehnologică și profesional (37 săptămâni)',
    },

    // Vacanța de vară
    {
      title: 'Vacanța de vară',
      startDate: new Date('2027-06-19'),
      endDate: new Date('2027-09-05'),
      type: 'VACATION' as const,
      description: 'Vacanța mare de vară (19 iunie - 5 septembrie 2027)',
    },
  ]

  for (const event of commonEvents) {
    await prisma.event.create({
      data: event,
    })
  }
  console.log('✅ Structura anului școlar 2026-2027 creată')

  console.log('🎉 Seeding complete!')
  console.log('')
  console.log('📊 Statistici:')
  console.log(`   - 3 grupe de vacanță intersemestrială (15 feb - 7 mar 2027)`)
  console.log(`   - 42 județe + București`)
  console.log(`   - ${commonEvents.length} evenimente comune`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
