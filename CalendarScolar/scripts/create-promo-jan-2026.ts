import { PrismaClient, EventType } from '@prisma/client'

const prisma = new PrismaClient()

async function createPromoJan2026() {
  try {
    // Șterge promo-urile vechi
    await prisma.event.deleteMany({
      where: {
        title: 'Promo Test - Reducere 50%',
      },
    })

    // Creează promo-ul în ianuarie 2026 (anul curent din calendar)
    const promo = await prisma.event.create({
      data: {
        title: 'Promo Test - Reducere 50%',
        description: 'Oferta specială pentru studenți! Reducere de 50% la toate produsele.',
        startDate: new Date('2026-01-15T00:00:00Z'), // Ianuarie 2026
        endDate: new Date('2026-01-20T23:59:59Z'),
        type: EventType.VACATION,
        isAd: false,
        active: true,
      },
    })

    console.log('✅ Promo creat în ianuarie 2026!')
    console.log('ID:', promo.id)
    console.log('Titlu:', promo.title)
    console.log('Data început:', promo.startDate)
    console.log('Data sfârșit:', promo.endDate)
    console.log('\n📅 Promo-ul ar trebui să apară în calendar între 15-20 ianuarie 2026')
  } catch (error) {
    console.error('❌ Eroare la crearea promo-ului:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createPromoJan2026()





