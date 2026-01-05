import { PrismaClient, EventType } from '@prisma/client'

const prisma = new PrismaClient()

async function createPromoAsVacation() {
  try {
    // Șterge promo-urile vechi
    await prisma.event.deleteMany({
      where: {
        title: 'Promo Test - Reducere 50%',
      },
    })

    // Creează promo-ul exact ca "Vacanța de iarnă" - cu type VACATION și isAd false
    const promo = await prisma.event.create({
      data: {
        title: 'Promo Test - Reducere 50%',
        description: 'Oferta specială pentru studenți! Reducere de 50% la toate produsele.',
        startDate: new Date('2025-01-15T00:00:00Z'), // Exact la miezul nopții ca celelalte
        endDate: new Date('2025-01-20T23:59:59Z'), // Exact la sfârșitul zilei ca celelalte
        type: EventType.VACATION, // La fel ca "Vacanța de iarnă"
        isAd: false, // Nu este marcat ca reclamă
        active: true,
      },
    })

    console.log('✅ Promo creat ca VACATION (exact ca celelalte evenimente)!')
    console.log('ID:', promo.id)
    console.log('Titlu:', promo.title)
    console.log('Tip:', promo.type)
    console.log('isAd:', promo.isAd)
    console.log('Data început:', promo.startDate)
    console.log('Data sfârșit:', promo.endDate)
    console.log('\n📅 Promo-ul ar trebui să apară în calendar după refresh')
  } catch (error) {
    console.error('❌ Eroare la crearea promo-ului:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createPromoAsVacation()





