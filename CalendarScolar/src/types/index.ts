import { EventType, Role } from '@prisma/client'

export type { EventType, Role }

export interface EventFormData {
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  type: EventType
  imageUrl?: string
  backgroundColor?: string
  active: boolean
}

export interface PromoFormData {
  title: string
  description?: string
  imageUrl?: string
  link?: string
  startDate: Date
  endDate: Date
  showOnCalendar: boolean
  showAsBanner: boolean
  backgroundColor?: string
  priority: number
  active: boolean
  countyIds: string[]
}

export interface ICSOptions {
  includeAds?: boolean
  token?: string
}
