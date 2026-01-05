import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteOldPromo() {
  try {
    // Șterge promo-ul vechi (cel cu data 2025-01-14)
    const deleted = await prisma.event.deleteMany({
      where: {
        title: 'Promo Test - Reducere 50%',
        startDate: {
          lt: new Date('2025-01-15T00:00:00Z')
        }
      },
    })

    console.log(`✅ Șters ${deleted.count} promo-uri vechi`)
  } catch (error) {
    console.error('❌ Eroare la ștergere:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

deleteOldPromo()





