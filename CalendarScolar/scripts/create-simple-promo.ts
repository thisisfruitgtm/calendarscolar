import { PrismaClient, EventType } from '@prisma/client'

const prisma = new PrismaClient()

async function createSimplePromo() {
  try {
    // Șterge promo-urile vechi
    await prisma.event.deleteMany({
      where: {
        title: 'Promo Test - Reducere 50%',
      },
    })

    // Creează un promo simplu fără imageUrl și adLink pentru test
    const promo = await prisma.event.create({
      data: {
        title: 'Promo Test - Reducere 50%',
        description: 'Oferta specială pentru studenți! Reducere de 50% la toate produsele.',
        startDate: new Date('2025-01-15T12:00:00Z'),
        endDate: new Date('2025-01-20T12:00:00Z'),
        type: EventType.PROMO,
        isAd: true,
        active: true,
        // Fără imageUrl și adLink pentru test
      },
    })

    console.log('✅ Promo simplu creat cu succes!')
    console.log('ID:', promo.id)
    console.log('Titlu:', promo.title)
    console.log('Data început:', promo.startDate)
    console.log('Data sfârșit:', promo.endDate)
    console.log('\n📅 Promo-ul simplu ar trebui să apară în calendar după refresh')
  } catch (error) {
    console.error('❌ Eroare la crearea promo-ului:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createSimplePromo()





