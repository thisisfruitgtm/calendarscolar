import { EventType, Role } from '@prisma/client'

export type { EventType, Role }

export interface EventFormData {
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  type: EventType
  imageUrl?: string
  isAd: boolean
  adLink?: string
  active: boolean
}

export interface ICSOptions {
  includeAds?: boolean
  token?: string
}





