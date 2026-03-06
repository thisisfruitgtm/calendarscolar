/**
 * Migration script: Update calendar to match Ordin Nr. 3.194/2026
 * (Monitorul Oficial Nr. 126/16.II.2026)
 *
 * Run with: npx tsx prisma/update-2026-2027-official.ts
 *
 * This script updates existing events WITHOUT resetting the database.
 * Safe to run multiple times (idempotent).
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('📋 Updating calendar to match Ordin Nr. 3.194/2026...\n')

  let updated = 0
  let created = 0

  // Sync admin password from env var
  if (process.env.ADMIN_PASSWORD) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)
    await prisma.user.update({
      where: { email: 'admin@calendarscolar.ro' },
      data: { password: hashedPassword },
    })
    updated++
    console.log('✅ ACTUALIZAT: Parola admin sincronizată din ADMIN_PASSWORD')
  }

  // 1. ADD: Vacanța de toamnă (NEW - not in previous version)
  const autumnVacation = await prisma.event.findFirst({
    where: { title: { contains: 'toamnă' } },
  })
  if (!autumnVacation) {
    await prisma.event.create({
      data: {
        title: 'Vacanța de toamnă',
        startDate: new Date('2026-10-24'),
        endDate: new Date('2026-11-01'),
        type: 'VACATION',
        description: 'Vacanța de toamnă (24 octombrie - 1 noiembrie 2026)',
        active: true,
      },
    })
    created++
    console.log('✅ CREAT: Vacanța de toamnă (24 oct - 1 nov 2026)')
  } else {
    await prisma.event.update({
      where: { id: autumnVacation.id },
      data: {
        startDate: new Date('2026-10-24'),
        endDate: new Date('2026-11-01'),
        description: 'Vacanța de toamnă (24 octombrie - 1 noiembrie 2026)',
      },
    })
    updated++
    console.log('✅ ACTUALIZAT: Vacanța de toamnă')
  }

  // 2. FIX: Vacanța de iarnă (was Dec 21 - Jan 3, should be Dec 23 - Jan 10)
  const winterVacation = await prisma.event.findFirst({
    where: { title: { contains: 'iarnă' } },
  })
  if (winterVacation) {
    await prisma.event.update({
      where: { id: winterVacation.id },
      data: {
        startDate: new Date('2026-12-23'),
        endDate: new Date('2027-01-10'),
        description: 'Vacanța de Crăciun și Anul Nou (23 decembrie 2026 - 10 ianuarie 2027)',
      },
    })
    updated++
    console.log('✅ ACTUALIZAT: Vacanța de iarnă → 23 dec - 10 ian')
  }

  // 3. FIX: Început semestru II (was Jan 4, should be Jan 11)
  const sem2Start = await prisma.event.findFirst({
    where: { title: { contains: 'semestru II' } },
  })
  if (sem2Start) {
    await prisma.event.update({
      where: { id: sem2Start.id },
      data: {
        startDate: new Date('2027-01-11'),
        description: 'Reluarea cursurilor după vacanța de iarnă (11 ianuarie 2027)',
      },
    })
    updated++
    console.log('✅ ACTUALIZAT: Început semestru II → 11 ianuarie 2027')
  }

  // 4. FIX: Vacanța de primăvară (was Apr 19 - May 3, should be Apr 24 - May 4)
  const springVacation = await prisma.event.findFirst({
    where: { title: { contains: 'primăvară' } },
  })
  if (springVacation) {
    await prisma.event.update({
      where: { id: springVacation.id },
      data: {
        startDate: new Date('2027-04-24'),
        endDate: new Date('2027-05-04'),
        description: 'Vacanța de Paște (24 aprilie - 4 mai 2027, include Paștele Ortodox 2 mai)',
      },
    })
    updated++
    console.log('✅ ACTUALIZAT: Vacanța de primăvară → 24 apr - 4 mai')
  }

  // 5. FIX: Vacanța de vară (end was Sep 6, should be Sep 5)
  const summerVacation = await prisma.event.findFirst({
    where: { title: { contains: 'vară' } },
  })
  if (summerVacation) {
    await prisma.event.update({
      where: { id: summerVacation.id },
      data: {
        endDate: new Date('2027-09-05'),
        description: 'Vacanța mare de vară (19 iunie - 5 septembrie 2027)',
      },
    })
    updated++
    console.log('✅ ACTUALIZAT: Vacanța de vară → 19 iun - 5 sep')
  }

  // 6. ADD: Ultima zi liceu tehnologic/profesional (NEW)
  const techLastDay = await prisma.event.findFirst({
    where: { title: { contains: 'tehnologic' } },
  })
  if (!techLastDay) {
    await prisma.event.create({
      data: {
        title: 'Ultima zi - liceu tehnologic/profesional',
        startDate: new Date('2027-06-25'),
        type: 'LAST_DAY',
        description: 'Ultima zi de cursuri pentru clasele din învățământul liceal filiera tehnologică și profesional (37 săptămâni)',
        active: true,
      },
    })
    created++
    console.log('✅ CREAT: Ultima zi liceu tehnologic/profesional (25 iun 2027)')
  }

  // 7. FIX: 5 Octombrie description (now confirmed as "Ziua internațională a educației")
  const educationDay = await prisma.event.findFirst({
    where: { title: { contains: 'Octombrie' } },
  })
  if (educationDay) {
    await prisma.event.update({
      where: { id: educationDay.id },
      data: {
        title: '5 Octombrie - Ziua internațională a educației',
        description: 'Ziua internațională a educației - nu se organizează cursuri (conform Art. 3)',
      },
    })
    updated++
    console.log('✅ ACTUALIZAT: 5 Octombrie - denumire oficială')
  }

  // 8. FIX: Cluj → Grupa A (ISJ Cluj decizie 24.02.2026: vacanță 15-21 feb 2027)
  const clujCounty = await prisma.county.findFirst({
    where: { slug: 'cluj' },
    include: { group: true },
  })
  const grupaA = await prisma.vacationGroup.findFirst({
    where: { name: 'Grupa A' },
  })
  if (clujCounty && grupaA && clujCounty.groupId !== grupaA.id) {
    await prisma.county.update({
      where: { id: clujCounty.id },
      data: { groupId: grupaA.id },
    })
    updated++
    console.log('✅ ACTUALIZAT: Cluj mutat din ' + (clujCounty.group?.name ?? 'grupa necunoscută') + ' → Grupa A (ISJ decizie 24.02.2026)')
  } else if (clujCounty && grupaA && clujCounty.groupId === grupaA.id) {
    console.log('ℹ️  Cluj deja în Grupa A - skip')
  }

  // 9. ADD: Evenimente 2025-2026 rămase (martie - septembrie 2026)
  const events2025_2026 = [
    {
      title: 'Vacanța de primăvară 2026',
      startDate: new Date('2026-04-11'),
      endDate: new Date('2026-04-21'),
      type: 'VACATION' as const,
      description: 'Vacanța de Paște (11-21 aprilie 2026, include Paștele Ortodox 12 aprilie)',
    },
    {
      title: '1 Mai 2026 - Ziua Muncii',
      startDate: new Date('2026-05-01'),
      type: 'HOLIDAY' as const,
      description: 'Ziua Internațională a Muncii - zi liberă',
    },
    {
      title: 'Rusalii 2026',
      startDate: new Date('2026-05-31'),
      endDate: new Date('2026-06-01'),
      type: 'HOLIDAY' as const,
      description: 'Rusalii (31 mai - 1 iunie 2026) - sărbătoare legală',
    },
    {
      title: '1 Iunie 2026 - Ziua Copilului',
      startDate: new Date('2026-06-01'),
      type: 'HOLIDAY' as const,
      description: 'Ziua Copilului - zi liberă',
    },
    {
      title: 'Ultima zi 2026 - clasele XII/XIII',
      startDate: new Date('2026-06-05'),
      type: 'LAST_DAY' as const,
      description: 'Ultima zi de cursuri 2025-2026 pentru elevii claselor a XII-a zi, a XIII-a seral (34 săptămâni)',
    },
    {
      title: 'Ultima zi 2026 - clasa a VIII-a',
      startDate: new Date('2026-06-12'),
      type: 'LAST_DAY' as const,
      description: 'Ultima zi de cursuri 2025-2026 pentru elevii clasei a VIII-a (35 săptămâni)',
    },
    {
      title: 'Sfârșit an școlar 2025-2026',
      startDate: new Date('2026-06-19'),
      type: 'LAST_DAY' as const,
      description: 'Ultima zi de școală 2025-2026 pentru clasele I-VII și IX-XI (36 săptămâni)',
    },
    {
      title: 'Vacanța de vară 2026',
      startDate: new Date('2026-06-20'),
      endDate: new Date('2026-09-06'),
      type: 'VACATION' as const,
      description: 'Vacanța mare de vară 2026 (20 iunie - 6 septembrie 2026)',
    },
  ]

  for (const event of events2025_2026) {
    const exists = await prisma.event.findFirst({
      where: { title: event.title },
    })
    if (!exists) {
      await prisma.event.create({ data: event })
      created++
      console.log(`✅ CREAT: ${event.title}`)
    } else {
      console.log(`ℹ️  ${event.title} - deja există, skip`)
    }
  }

  console.log(`\n📊 Rezumat: ${created} create, ${updated} actualizate`)
  console.log('✅ Calendar actualizat conform Ordin Nr. 3.194/2026 + decizii ISJ')
}

main()
  .catch((e) => {
    console.error('❌ Eroare:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
