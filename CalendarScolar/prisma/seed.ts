import { PrismaClient, VacationType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Județele grupate conform imaginii oficiale MEC
const GRUPA_A = { // 9-15 februarie 2026 - Albastru închis
  name: 'Grupa A',
  color: '#1E40AF', // dark blue
  counties: [
    { name: 'Timiș', slug: 'timis', capitalCity: 'Timișoara', population: 683540 },
    { name: 'Caraș-Severin', slug: 'caras-severin', capitalCity: 'Reșița', population: 267995 },
    { name: 'Gorj', slug: 'gorj', capitalCity: 'Târgu Jiu', population: 323317 },
    { name: 'Mehedinți', slug: 'mehedinti', capitalCity: 'Drobeta-Turnu Severin', population: 254570 },
    { name: 'Dolj', slug: 'dolj', capitalCity: 'Craiova', population: 654368 },
  ],
  vacation: {
    name: 'Vacanța intersemestrială',
    startDate: new Date('2026-02-09'),
    endDate: new Date('2026-02-15'),
  }
}

const GRUPA_B = { // 16-22 februarie 2026 - Albastru deschis
  name: 'Grupa B',
  color: '#60A5FA', // light blue
  counties: [
    { name: 'Arad', slug: 'arad', capitalCity: 'Arad', population: 409072 },
    { name: 'Bihor', slug: 'bihor', capitalCity: 'Oradea', population: 551297 },
    { name: 'Satu Mare', slug: 'satu-mare', capitalCity: 'Satu Mare', population: 330445 },
    { name: 'Sălaj', slug: 'salaj', capitalCity: 'Zalău', population: 218958 },
    { name: 'Cluj', slug: 'cluj', capitalCity: 'Cluj-Napoca', population: 736301 },
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
    startDate: new Date('2026-02-16'),
    endDate: new Date('2026-02-22'),
  }
}

const GRUPA_C = { // 23 februarie - 1 martie 2026 - Verde
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
    startDate: new Date('2026-02-23'),
    endDate: new Date('2026-03-01'),
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
      calendarName: 'Calendar Școlar 2025-2026',
      schoolYear: '2025-2026',
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
        schoolYear: '2025-2026',
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
          metaTitle: `Calendar Școlar ${county.name} 2025-2026 | Vacanțe și Zile Libere`,
          metaDescription: `Calendar școlar complet pentru județul ${county.name} (${county.capitalCity}). Vezi toate vacanțele, zilele libere și structura anului școlar 2025-2026.`,
        },
      })
    }

    console.log(`✅ ${grupa.name} created with ${grupa.counties.length} counties`)
  }

  // Structura anului școlar 2025-2026 conform ordinului MEC
  const commonEvents = [
    // Semestrul I
    {
      title: 'Început an școlar 2025-2026',
      startDate: new Date('2025-09-08'),
      type: 'SEMESTER_START' as const,
      description: 'Prima zi de școală. Cursuri: 8 septembrie 2025 - 19 decembrie 2025 (15 săptămâni)',
    },
    
    // Sărbători legale
    {
      title: '5 Octombrie - Ziua Mondială a Educației',
      startDate: new Date('2025-10-05'),
      type: 'HOLIDAY' as const,
      description: 'Ziua Mondială a Educației - zi liberă',
    },
    {
      title: '30 Noiembrie - Sfântul Andrei',
      startDate: new Date('2025-11-30'),
      type: 'HOLIDAY' as const,
      description: 'Sărbătoare legală - zi liberă',
    },
    {
      title: '1 Decembrie - Ziua Națională',
      startDate: new Date('2025-12-01'),
      type: 'HOLIDAY' as const,
      description: 'Ziua Națională a României - zi liberă',
    },
    
    // Vacanța de iarnă
    {
      title: 'Vacanța de iarnă',
      startDate: new Date('2025-12-20'),
      endDate: new Date('2026-01-07'),
      type: 'VACATION' as const,
      description: 'Vacanța de Crăciun și Anul Nou (20 decembrie 2025 - 7 ianuarie 2026)',
    },
    
    // Semestrul II
    {
      title: 'Început semestru II',
      startDate: new Date('2026-01-08'),
      type: 'SEMESTER_START' as const,
      description: 'Reluarea cursurilor după vacanța de iarnă - Modul 3',
    },
    
    // Sărbătoarea Unirii
    {
      title: '24 Ianuarie - Unirea Principatelor',
      startDate: new Date('2026-01-24'),
      type: 'HOLIDAY' as const,
      description: 'Ziua Unirii Principatelor Române - zi liberă',
    },
    
    // Vacanța de primăvară (Paște)
    {
      title: 'Vacanța de primăvară',
      startDate: new Date('2026-04-04'),
      endDate: new Date('2026-04-14'),
      type: 'VACATION' as const,
      description: 'Vacanța de Paște (4 aprilie - 14 aprilie 2026)',
    },
    
    // 1 Mai
    {
      title: '1 Mai - Ziua Muncii',
      startDate: new Date('2026-05-01'),
      type: 'HOLIDAY' as const,
      description: 'Ziua Internațională a Muncii - zi liberă',
    },
    
    // Rusalii și Ziua Copilului (a doua zi de Rusalii se suprapune cu 1 iunie)
    {
      title: 'Rusalii și Ziua Copilului',
      startDate: new Date('2026-05-31'),
      endDate: new Date('2026-06-01'),
      type: 'HOLIDAY' as const,
      description: 'Rusalii și Ziua Copilului (31 mai - 1 iunie 2026)',
    },
    
    // Ziua Învățătorului
    {
      title: '5 Iunie - Ziua Învățătorului',
      startDate: new Date('2026-06-05'),
      type: 'HOLIDAY' as const,
      description: 'Ziua Învățătorului - zi liberă',
    },
    
    // Ultima zi pentru clasa a VIII-a
    {
      title: 'Ultima zi - clasa a VIII-a',
      startDate: new Date('2026-06-05'),
      type: 'LAST_DAY' as const,
      description: 'Ultima zi de cursuri pentru elevii clasei a VIII-a (vineri, săptămâna 35)',
    },
    
    // Ultima zi pentru clasele XII-XIII
    {
      title: 'Ultima zi - clasele XII/XIII',
      startDate: new Date('2026-06-12'),
      type: 'LAST_DAY' as const,
      description: 'Ultima zi de cursuri pentru elevii claselor a XII-a zi, a XIII-a seral și frecvență redusă',
    },
    
    // Sfârșit an școlar
    {
      title: 'Sfârșit an școlar',
      startDate: new Date('2026-06-19'),
      type: 'LAST_DAY' as const,
      description: 'Ultima zi de școală pentru clasele I-VII și IX-XI (vineri, săptămâna 37)',
    },
    
    // Vacanța de vară
    {
      title: 'Vacanța de vară',
      startDate: new Date('2026-06-20'),
      endDate: new Date('2026-09-06'),
      type: 'VACATION' as const,
      description: 'Vacanța mare de vară',
    },
  ]

  for (const event of commonEvents) {
    await prisma.event.create({
      data: event,
    })
  }
  console.log('✅ Structura anului școlar 2025-2026 creată')

  console.log('🎉 Seeding complete!')
  console.log('')
  console.log('📊 Statistici:')
  console.log(`   - 3 grupe de vacanță intersemestrială`)
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
