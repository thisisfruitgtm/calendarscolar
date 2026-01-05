import { PrismaClient, EventType } from '@prisma/client'

const prisma = new PrismaClient()

async function addTestPromo() {
  try {
    // Creează un promo de test pentru ianuarie
    const promo = await prisma.event.create({
      data: {
        title: 'Promo Test - Reducere 50%',
        description: 'Oferta specială pentru studenți! Reducere de 50% la toate produsele.',
        startDate: new Date('2025-01-15T12:00:00Z'), // Noon UTC to avoid timezone issues
        endDate: new Date('2025-01-20T12:00:00Z'),
        type: EventType.PROMO,
        isAd: true,
        active: true,
        imageUrl: 'https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Promo+Test',
        adLink: 'https://example.com/promo',
      },
    })

    console.log('✅ Promo de test creat cu succes!')
    console.log('ID:', promo.id)
    console.log('Titlu:', promo.title)
    console.log('Data început:', promo.startDate)
    console.log('Data sfârșit:', promo.endDate)
    console.log('\n📅 Evenimentul va apărea în calendar între 15-20 ianuarie 2025')
  } catch (error) {
    console.error('❌ Eroare la crearea promo-ului:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addTestPromo()

