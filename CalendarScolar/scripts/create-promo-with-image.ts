import { PrismaClient, EventType } from '@prisma/client'

const prisma = new PrismaClient()

async function createPromoWithImage() {
  try {
    // Creează un promo cu imagine și URL pentru test
    const promo = await prisma.event.create({
      data: {
        title: 'Promo Test cu Imagine',
        description: 'Test promo cu imagine și link.',
        startDate: new Date('2026-01-25T00:00:00Z'),
        endDate: new Date('2026-01-27T23:59:59Z'),
        type: EventType.PROMO,
        isAd: true,
        active: true,
        imageUrl: 'https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Promo+Test',
        adLink: 'https://example.com/promo',
      },
    })

    console.log('✅ Promo cu imagine și URL creat!')
    console.log('ID:', promo.id)
    console.log('Titlu:', promo.title)
    console.log('Data început:', promo.startDate)
    console.log('Data sfârșit:', promo.endDate)
    console.log('Image URL:', promo.imageUrl)
    console.log('Ad Link:', promo.adLink)
    console.log('\n📅 Promo-ul ar trebui să apară în calendar între 25-27 ianuarie 2026')
    console.log('🖼️  Cu imagine și link funcțional')
  } catch (error) {
    console.error('❌ Eroare la crearea promo-ului:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createPromoWithImage()

