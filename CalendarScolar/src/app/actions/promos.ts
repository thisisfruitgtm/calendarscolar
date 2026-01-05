'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache'
import { z } from 'zod'
import { sanitizeHtml } from '@/lib/sanitize'

const promoSchema = z.object({
  title: z.string().min(1, 'Titlul este obligatoriu').max(200, 'Titlul este prea lung'),
  description: z.string().max(5000, 'Descrierea este prea lungă').optional(),
  imageUrl: z.string().url('URL imagine invalid').max(500, 'URL prea lung').optional().or(z.literal('')),
  link: z.string().url('URL link invalid').max(500, 'URL prea lung').optional().or(z.literal('')),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  showOnCalendar: z.boolean(),
  showAsBanner: z.boolean(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Culoare invalidă (format hex)').optional().or(z.literal('')),
  priority: z.number().int().min(0).max(100),
  countyIds: z.array(z.string().regex(/^c[a-z0-9]{24}$/, 'ID județ invalid')).optional(),
  active: z.boolean(),
}).refine((data) => data.endDate >= data.startDate, {
  message: 'Data de sfârșit trebuie să fie după data de început',
  path: ['endDate'],
})

export async function createPromo(data: unknown) {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    throw new Error('Operation failed')
  }

  const validated = promoSchema.parse(data)

  // Sanitize HTML in description
  const { countyIds, ...promoData } = validated
  const sanitizedData = {
    ...promoData,
    description: promoData.description ? await sanitizeHtml(promoData.description) : promoData.description,
  }

  const promo = await db.promo.create({
    data: {
      ...sanitizedData,
      counties: countyIds && countyIds.length > 0 ? {
        create: countyIds.map(countyId => ({ countyId }))
      } : undefined,
    },
  })

  revalidatePath('/admin/promos')
  revalidateTag(CACHE_TAGS.PROMOS, 'default')
  return promo
}

export async function updatePromo(id: string, data: unknown) {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    throw new Error('Operation failed')
  }

  // Validate ID format
  if (!/^c[a-z0-9]{24}$/.test(id)) {
    throw new Error('Operation failed')
  }

  const validated = promoSchema.parse(data)

  // Sanitize HTML in description
  const { countyIds, ...promoData } = validated
  const sanitizedData = {
    ...promoData,
    description: promoData.description ? await sanitizeHtml(promoData.description) : promoData.description,
  }

  // Use transaction for atomic update
  const promo = await db.$transaction(async (tx) => {
    // Delete existing county associations
    await tx.promoCounty.deleteMany({
      where: { promoId: id },
    })

    // Update promo with new counties
    return tx.promo.update({
      where: { id },
      data: {
        ...sanitizedData,
        counties: countyIds && countyIds.length > 0 ? {
          create: countyIds.map(countyId => ({ countyId }))
        } : undefined,
      },
    })
  })

  revalidatePath('/admin/promos')
  revalidateTag(CACHE_TAGS.PROMOS, 'default')
  return promo
}

export async function deletePromo(id: string) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Operation failed')
  }

  // Validate ID format
  if (!/^c[a-z0-9]{24}$/.test(id)) {
    throw new Error('Operation failed')
  }

  await db.promo.delete({
    where: { id },
  })

  revalidatePath('/admin/promos')
  revalidateTag(CACHE_TAGS.PROMOS, 'default')
}

export async function togglePromoActive(id: string) {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    throw new Error('Operation failed')
  }

  // Validate ID format
  if (!/^c[a-z0-9]{24}$/.test(id)) {
    throw new Error('Operation failed')
  }

  const promo = await db.promo.findUnique({ where: { id } })
  if (!promo) {
    throw new Error('Operation failed')
  }

  const updated = await db.promo.update({
    where: { id },
    data: { active: !promo.active },
  })

  revalidatePath('/admin/promos')
  revalidateTag(CACHE_TAGS.PROMOS, 'default')
  return updated
}

export async function trackPromoClick(id: string) {
  // Validate ID format
  if (!/^c[a-z0-9]{24}$/.test(id)) {
    return
  }

  await db.promo.update({
    where: { id },
    data: { clicks: { increment: 1 } },
  })
}

export async function trackPromoImpression(id: string) {
  // Validate ID format
  if (!/^c[a-z0-9]{24}$/.test(id)) {
    return
  }

  await db.promo.update({
    where: { id },
    data: { impressions: { increment: 1 } },
  })
}

