import { PrismaClient, VacationType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Migrare la anul școlar 2026-2027...')

  // 1. Dezactivează evenimentele vechi 2025-2026
  const deactivated = await prisma.event.updateMany({
    where: { active: true },
    data: { active: false },
  })
  console.log(`✅ ${deactivated.count} evenimente vechi dezactivate`)

  // 2. Actualizează Settings
  await prisma.settings.update({
    where: { id: 'settings' },
    data: {
      calendarName: 'Calendar Școlar 2026-2027',
      schoolYear: '2026-2027',
    },
  })
  console.log('✅ Settings actualizat la 2026-2027')

  // 3. Actualizează VacationPeriods (vacanța intersemestrială ISJ/ISMB)
  // Perioadele noi: 15 feb - 7 mar 2027, conform OME
  const vacationPeriods = await prisma.vacationPeriod.findMany({
    include: { group: true },
    orderBy: { startDate: 'asc' },
  })

  for (const period of vacationPeriods) {
    let newStart: Date
    let newEnd: Date

    if (period.group.name === 'Grupa A') {
      newStart = new Date('2027-02-15')
      newEnd = new Date('2027-02-21')
    } else if (period.group.name === 'Grupa B') {
      newStart = new Date('2027-02-22')
      newEnd = new Date('2027-02-28')
    } else {
      // Grupa C
      newStart = new Date('2027-03-01')
      newEnd = new Date('2027-03-07')
    }

    await prisma.vacationPeriod.update({
      where: { id: period.id },
      data: {
        startDate: newStart,
        endDate: newEnd,
        schoolYear: '2026-2027',
      },
    })
    console.log(`✅ ${period.group.name}: ${newStart.toISOString().split('T')[0]} - ${newEnd.toISOString().split('T')[0]}`)
  }

  // 4. Creează evenimentele noi 2026-2027
  // Conform structurii oficiale MEC (Ordin Ministru)
  const events = [
    // Semestrul I
    {
      title: 'Început an școlar 2026-2027',
      startDate: new Date('2026-09-07'),
      type: 'SEMESTER_START' as const,
      description: 'Prima zi de școală. Cursuri: 7 septembrie 2026 - 18 iunie 2027 (36 săptămâni)',
    },

    // Ziua Educației
    {
      title: '5 Octombrie - Ziua Educației',
      startDate: new Date('2026-10-05'),
      type: 'HOLIDAY' as const,
      description: 'Ziua Educației - zi liberă',
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
      startDate: new Date('2026-12-21'),
      endDate: new Date('2027-01-03'),
      type: 'VACATION' as const,
      description: 'Vacanța de Crăciun și Anul Nou (21 decembrie 2026 - 3 ianuarie 2027)',
    },

    // Semestrul II
    {
      title: 'Început semestru II',
      startDate: new Date('2027-01-04'),
      type: 'SEMESTER_START' as const,
      description: 'Reluarea cursurilor după vacanța de iarnă',
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
      startDate: new Date('2027-04-19'),
      endDate: new Date('2027-05-03'),
      type: 'VACATION' as const,
      description: 'Vacanța de Paște (19 aprilie - 3 mai 2027, include Paștele Ortodox)',
    },

    // 1 Mai - Ziua Muncii
    {
      title: '1 Mai - Ziua Muncii',
      startDate: new Date('2027-05-01'),
      type: 'HOLIDAY' as const,
      description: 'Ziua Internațională a Muncii - zi liberă (sâmbătă)',
    },

    // 1 Iunie - Ziua Copilului
    {
      title: '1 Iunie - Ziua Copilului',
      startDate: new Date('2027-06-01'),
      type: 'HOLIDAY' as const,
      description: 'Ziua Copilului - zi liberă',
    },

    // Ultima zi - clasele XII/XIII
    {
      title: 'Ultima zi - clasele XII/XIII',
      startDate: new Date('2027-06-04'),
      type: 'LAST_DAY' as const,
      description: 'Ultima zi de cursuri pentru elevii claselor a XII-a zi, a XIII-a seral și frecvență redusă (34 săptămâni)',
    },

    // Ultima zi - clasa a VIII-a
    {
      title: 'Ultima zi - clasa a VIII-a',
      startDate: new Date('2027-06-11'),
      type: 'LAST_DAY' as const,
      description: 'Ultima zi de cursuri pentru elevii clasei a VIII-a (vineri, săptămâna 35)',
    },

    // Sfârșit an școlar
    {
      title: 'Sfârșit an școlar',
      startDate: new Date('2027-06-18'),
      type: 'LAST_DAY' as const,
      description: 'Ultima zi de școală pentru clasele I-VII și IX-XI (vineri, săptămâna 36)',
    },

    // Rusalii (Pentecost - 50 zile după Paștele Ortodox)
    {
      title: 'Rusalii',
      startDate: new Date('2027-06-20'),
      endDate: new Date('2027-06-21'),
      type: 'HOLIDAY' as const,
      description: 'Rusalii (20-21 iunie 2027)',
    },

    // Vacanța de vară
    {
      title: 'Vacanța de vară',
      startDate: new Date('2027-06-19'),
      endDate: new Date('2027-09-06'),
      type: 'VACATION' as const,
      description: 'Vacanța mare de vară',
    },
  ]

  for (const event of events) {
    await prisma.event.create({ data: event })
  }
  console.log(`✅ ${events.length} evenimente noi create pentru 2026-2027`)

  // 5. Actualizează metaTitle și metaDescription pentru toate județele
  const counties = await prisma.county.findMany()
  for (const county of counties) {
    await prisma.county.update({
      where: { id: county.id },
      data: {
        metaTitle: `Calendar Școlar ${county.name} 2026-2027 | Vacanțe și Zile Libere`,
        metaDescription: `Calendar școlar complet pentru județul ${county.name} (${county.capitalCity}). Vezi toate vacanțele, zilele libere și structura anului școlar 2026-2027.`,
      },
    })
  }
  console.log(`✅ ${counties.length} județe actualizate cu meta SEO 2026-2027`)

  console.log('')
  console.log('🎉 Migrare completă!')
  console.log('')
  console.log('📊 Rezumat:')
  console.log(`   - ${deactivated.count} evenimente vechi dezactivate`)
  console.log(`   - ${events.length} evenimente noi 2026-2027`)
  console.log(`   - ${vacationPeriods.length} perioade de vacanță ISJ actualizate (15 feb - 7 mar 2027)`)
  console.log(`   - ${counties.length} județe cu meta SEO actualizat`)
  console.log(`   - Settings: Calendar Școlar 2026-2027`)
}

main()
  .catch((e) => {
    console.error('❌ Eroare la migrare:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
