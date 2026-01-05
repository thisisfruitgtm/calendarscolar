'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache'
import { z } from 'zod'
import { EventType } from '@prisma/client'
import { sanitizeHtml } from '@/lib/sanitize'

const eventSchema = z.object({
  title: z.string().min(1, 'Titlul este obligatoriu').max(200, 'Titlul este prea lung'),
  description: z.string().max(5000, 'Descrierea este prea lungă').optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  type: z.nativeEnum(EventType),
  imageUrl: z.string().url('URL imagine invalid').max(500, 'URL prea lung').optional().or(z.literal('')),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Culoare invalidă (format hex)').optional().or(z.literal('')),
  countyId: z.string().regex(/^c[a-z0-9]{24}$/, 'ID județ invalid').optional().nullable(),
  active: z.boolean(),
})

export async function createEvent(data: unknown) {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    throw new Error('Operation failed')
  }

  const validated = eventSchema.parse(data)

  // Sanitize HTML in description
  const sanitizedData = {
    ...validated,
    description: validated.description ? await sanitizeHtml(validated.description) : validated.description,
  }

  const event = await db.event.create({
    data: sanitizedData,
  })

  revalidatePath('/admin/events')
  revalidatePath('/api/calendar')
  revalidateTag(CACHE_TAGS.EVENTS, 'default')
  return event
}

export async function updateEvent(id: string, data: unknown) {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    throw new Error('Operation failed')
  }

  // Validate ID format
  if (!/^c[a-z0-9]{24}$/.test(id)) {
    throw new Error('Operation failed')
  }

  const validated = eventSchema.parse(data)

  // Sanitize HTML in description
  const sanitizedData = {
    ...validated,
    description: validated.description ? await sanitizeHtml(validated.description) : validated.description,
  }

  const event = await db.event.update({
    where: { id },
    data: sanitizedData,
  })

  revalidatePath('/admin/events')
  revalidatePath('/api/calendar')
  revalidateTag(CACHE_TAGS.EVENTS, 'default')
  return event
}

export async function deleteEvent(id: string) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Operation failed')
  }

  // Validate ID format
  if (!/^c[a-z0-9]{24}$/.test(id)) {
    throw new Error('Operation failed')
  }

  await db.event.delete({
    where: { id },
  })

  revalidatePath('/admin/events')
  revalidatePath('/api/calendar')
  revalidateTag(CACHE_TAGS.EVENTS, 'default')
}

export async function toggleEventActive(id: string) {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    throw new Error('Operation failed')
  }

  // Validate ID format
  if (!/^c[a-z0-9]{24}$/.test(id)) {
    throw new Error('Operation failed')
  }

  const event = await db.event.findUnique({ where: { id } })
  if (!event) {
    throw new Error('Operation failed')
  }

  const updated = await db.event.update({
    where: { id },
    data: { active: !event.active },
  })

  revalidatePath('/admin/events')
  revalidatePath('/api/calendar')
  revalidateTag(CACHE_TAGS.EVENTS, 'default')
  return updated
}
