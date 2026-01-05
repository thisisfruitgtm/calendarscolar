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
  edupeduEnabled: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
  maintenanceMessage: z.string().max(500).optional(),
  schoolYear: z.string().regex(/^\d{4}-\d{4}$/, 'Format invalid (ex: 2025-2026)').optional(),
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
      schoolYear: validated.schoolYear || '2025-2026',
      ...validated,
    },
  })

  revalidatePath('/admin/settings')
  revalidatePath('/api/calendar')
  revalidateTag(CACHE_TAGS.SETTINGS, 'default')
  return settings
}

/**
 * Invalidate all caches - useful when making bulk changes
 */
export async function invalidateAllCaches() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Operation failed')
  }

  // Update last cache invalidation timestamp
  await db.settings.update({
    where: { id: 'settings' },
    data: { lastCacheInvalidation: new Date() },
  })

  // Invalidate all cache tags
  revalidateTag(CACHE_TAGS.COUNTIES, 'default')
  revalidateTag(CACHE_TAGS.COUNTY, 'default')
  revalidateTag(CACHE_TAGS.EVENTS, 'default')
  revalidateTag(CACHE_TAGS.PROMOS, 'default')
  revalidateTag(CACHE_TAGS.SETTINGS, 'default')
  revalidateTag(CACHE_TAGS.VACATION_PERIODS, 'default')
  
  // Revalidate main paths
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/api/calendar')
  
  return { success: true, timestamp: new Date() }
}

/**
 * Force refresh Edupedu articles cache
 */
export async function refreshEdupeduCache() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Operation failed')
  }

  // Update last refresh timestamp
  await db.settings.update({
    where: { id: 'settings' },
    data: { edupeduLastRefresh: new Date() },
  })

  // Force refresh by calling the API with refresh param
  // This clears the in-memory cache
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    await fetch(`${baseUrl}/api/edupedu-articles?refresh=true`, {
      cache: 'no-store',
    })
  } catch {
    // Ignore fetch errors - the cache will be cleared on next request
  }

  revalidatePath('/api/edupedu-articles')
  
  return { success: true, timestamp: new Date() }
}

