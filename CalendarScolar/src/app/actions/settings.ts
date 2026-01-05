'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache'
import { z } from 'zod'

const settingsSchema = z.object({
  adsEnabled: z.boolean(),
  calendarName: z.string().min(1).max(200, 'Numele calendarului este prea lung'),
  showCalendarDayNumbers: z.boolean().optional(),
})

export async function updateSettings(data: unknown) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Operation failed')
  }

  const validated = settingsSchema.parse(data)

  const settings = await db.settings.upsert({
    where: { id: 'settings' },
    update: validated,
    create: {
      id: 'settings',
      schoolYear: '2025-2026',
      ...validated,
    },
  })

  revalidatePath('/admin/settings')
  revalidatePath('/api/calendar')
  revalidateTag(CACHE_TAGS.SETTINGS, 'default')
  return settings
}

