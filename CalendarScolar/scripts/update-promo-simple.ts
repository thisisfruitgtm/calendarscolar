import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updatePromoSimple() {
  try {
    // Actualizează promo-ul pentru a fi mai simplu (fără imageUrl și adLink pentru test)
    const promo = await prisma.event.updateMany({
      where: {
        title: 'Promo Test - Reducere 50%',
      },
      data: {
        // Păstrăm tot, dar verificăm dacă există
        description: 'Oferta specială pentru studenți! Reducere de 50% la toate produsele.',
      },
    })

    console.log(`✅ Actualizat ${promo.count} promo-uri`)
    console.log('📅 Promo-ul ar trebui să apară în calendar după refresh')
  } catch (error) {
    console.error('❌ Eroare la actualizare:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updatePromoSimple()





