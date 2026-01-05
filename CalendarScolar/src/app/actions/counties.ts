'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache'
import { z } from 'zod'
import { VacationType } from '@prisma/client'

const vacationPeriodSchema = z.object({
  name: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  type: z.nativeEnum(VacationType),
  schoolYear: z.string(),
})

const vacationGroupSchema = z.object({
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
})

const countySchema = z.object({
  name: z.string().min(1).max(100, 'Numele este prea lung'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug invalid - doar litere mici, cifre și cratime').min(1).max(100),
  capitalCity: z.string().min(1).max(100, 'Reședința este prea lungă'),
  population: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().int().positive().max(10000000).optional()
  ),
  groupId: z.string().optional(),
  metaTitle: z.string().max(200, 'Meta title prea lung').optional(),
  metaDescription: z.string().max(500, 'Meta description prea lungă').optional(),
  active: z.boolean(),
})

export async function createVacationPeriod(groupId: string, data: unknown) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Operation failed')
  }

  // Validate groupId format
  if (!/^c[a-z0-9]{24}$/.test(groupId)) {
    throw new Error('Operation failed')
  }

  const validated = vacationPeriodSchema.parse(data)

  const period = await db.vacationPeriod.create({
    data: {
      ...validated,
      groupId,
    },
  })

  revalidatePath('/admin/counties')
  revalidatePath('/judete')
  revalidatePath(`/judet/*`)
  revalidateTag(CACHE_TAGS.VACATION_PERIODS)
  revalidateTag(CACHE_TAGS.COUNTY)
  return period
}

export async function updateVacationPeriod(id: string, data: unknown) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Operation failed')
  }

  // Validate ID format
  if (!/^c[a-z0-9]{24}$/.test(id)) {
    throw new Error('Operation failed')
  }

  const validated = vacationPeriodSchema.parse(data)

  const period = await db.vacationPeriod.update({
    where: { id },
    data: validated,
  })

  revalidatePath('/admin/counties')
  revalidatePath('/judete')
  revalidatePath(`/judet/*`)
  revalidateTag(CACHE_TAGS.VACATION_PERIODS)
  revalidateTag(CACHE_TAGS.COUNTY)
  return period
}

export async function deleteVacationPeriod(id: string) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Operation failed')
  }

  // Validate ID format
  if (!/^c[a-z0-9]{24}$/.test(id)) {
    throw new Error('Operation failed')
  }

  await db.vacationPeriod.delete({
    where: { id },
  })

  revalidatePath('/admin/counties')
  revalidatePath('/judete')
  revalidatePath(`/judet/*`)
  revalidateTag(CACHE_TAGS.VACATION_PERIODS)
  revalidateTag(CACHE_TAGS.COUNTY)
}

export async function updateVacationGroup(id: string, data: unknown) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Operation failed')
  }

  // Validate ID format
  if (!/^c[a-z0-9]{24}$/.test(id)) {
    throw new Error('Operation failed')
  }

  const validated = vacationGroupSchema.parse(data)

  const group = await db.vacationGroup.update({
    where: { id },
    data: validated,
  })

  revalidatePath('/admin/counties')
  revalidatePath('/judete')
  revalidatePath(`/judet/*`)
  revalidateTag(CACHE_TAGS.VACATION_PERIODS)
  revalidateTag(CACHE_TAGS.COUNTY)
  return group
}

export async function updateCounty(id: string, data: unknown) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Operation failed')
  }

  // Validate ID format
  if (!/^c[a-z0-9]{24}$/.test(id)) {
    throw new Error('Operation failed')
  }

  const validated = countySchema.parse(data)

  const county = await db.county.update({
    where: { id },
    data: validated,
  })

  revalidatePath('/admin/counties')
  revalidatePath('/judete')
  revalidatePath(`/judet/${county.slug}`)
  revalidateTag(CACHE_TAGS.COUNTIES)
  revalidateTag(CACHE_TAGS.COUNTY)
  revalidateTag(`${CACHE_TAGS.COUNTY}-${county.slug}`)
  return county
}

export async function toggleCountyActive(id: string) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Operation failed')
  }

  // Validate ID format
  if (!/^c[a-z0-9]{24}$/.test(id)) {
    throw new Error('Operation failed')
  }

  const county = await db.county.findUnique({ where: { id } })
  if (!county) {
    throw new Error('Operation failed')
  }

  const updated = await db.county.update({
    where: { id },
    data: { active: !county.active },
  })

  revalidatePath('/admin/counties')
  revalidatePath('/judete')
  revalidatePath(`/judet/${updated.slug}`)
  revalidateTag(CACHE_TAGS.COUNTIES)
  revalidateTag(CACHE_TAGS.COUNTY)
  revalidateTag(`${CACHE_TAGS.COUNTY}-${updated.slug}`)
  return updated
}

