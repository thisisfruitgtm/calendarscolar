import { unstable_cache } from 'next/cache'
import { db } from './db'

// Cache tags for invalidation
export const CACHE_TAGS = {
  COUNTIES: 'counties',
  COUNTY: 'county',
  EVENTS: 'events',
  PROMOS: 'promos',
  SETTINGS: 'settings',
  VACATION_PERIODS: 'vacation-periods',
} as const

/**
 * Get all active counties (cached)
 */
export async function getCachedActiveCounties() {
  return unstable_cache(
    async () => {
      return db.county.findMany({
        where: { active: true },
        select: {
          id: true,
          name: true,
          slug: true,
          capitalCity: true,
        },
        orderBy: { name: 'asc' },
      })
    },
    ['active-counties'],
    {
      tags: [CACHE_TAGS.COUNTIES],
      revalidate: false, // Only invalidate via tags
    }
  )()
}

/**
 * Get county by slug with group and periods (cached)
 */
export async function getCachedCountyBySlug(slug: string) {
  return unstable_cache(
    async () => {
      return db.county.findUnique({
        where: { slug },
        include: {
          group: {
            include: {
              periods: {
                where: { schoolYear: '2025-2026' },
                orderBy: { startDate: 'asc' },
              },
            },
          },
        },
      })
    },
    [`county-${slug}`],
    {
      tags: [CACHE_TAGS.COUNTY, `${CACHE_TAGS.COUNTY}-${slug}`],
      revalidate: false, // Only invalidate via tags
    }
  )()
}

/**
 * Get county by slug (minimal, for validation) (cached)
 */
export async function getCachedCountyMinimal(slug: string) {
  return unstable_cache(
    async () => {
      return db.county.findUnique({
        where: { slug },
        select: { id: true, active: true },
      })
    },
    [`county-minimal-${slug}`],
    {
      tags: [CACHE_TAGS.COUNTY, `${CACHE_TAGS.COUNTY}-${slug}`],
      revalidate: false, // Only invalidate via tags
    }
  )()
}

/**
 * Get all active events with county associations (cached)
 */
export async function getCachedActiveEvents() {
  return unstable_cache(
    async () => {
      return db.event.findMany({
        where: { active: true },
        include: {
          counties: {
            select: {
              countyId: true,
            },
          },
        },
        orderBy: { startDate: 'asc' },
      })
    },
    ['active-events'],
    {
      tags: [CACHE_TAGS.EVENTS],
      revalidate: false, // Only invalidate via tags
    }
  )()
}

/**
 * Get settings (cached)
 */
export async function getCachedSettings() {
  return unstable_cache(
    async () => {
      return db.settings.findUnique({
        where: { id: 'settings' },
      })
    },
    ['settings'],
    {
      tags: [CACHE_TAGS.SETTINGS],
      revalidate: false, // Only invalidate via tags
    }
  )()
}

/**
 * Get settings minimal (only updatedAt) (cached)
 */
export async function getCachedSettingsMinimal() {
  return unstable_cache(
    async () => {
      return db.settings.findUnique({
        where: { id: 'settings' },
        select: { updatedAt: true },
      })
    },
    ['settings-minimal'],
    {
      tags: [CACHE_TAGS.SETTINGS],
      revalidate: false, // Only invalidate via tags
    }
  )()
}

/**
 * Get all active promos with county associations (cached)
 */
export async function getCachedActivePromos() {
  return unstable_cache(
    async () => {
      const now = new Date()
      return db.promo.findMany({
        where: { 
          active: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
        include: {
          counties: {
            select: {
              countyId: true,
            },
          },
        },
        orderBy: [{ priority: 'desc' }, { startDate: 'asc' }],
      })
    },
    ['active-promos'],
    {
      tags: [CACHE_TAGS.PROMOS],
      revalidate: 60, // Revalidate every 60 seconds for date-based filtering
    }
  )()
}




