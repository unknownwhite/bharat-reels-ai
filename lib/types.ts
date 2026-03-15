export type VideoStatus = 'queued' | 'processing' | 'scheduled' | 'published' | 'failed'

export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'facebook'

export interface QueueItem {
  id: string
  title: string
  status: VideoStatus
  platform: Platform
  scheduledTime: string | null
  views: number
  likes: number
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  currency: string
  period: string
  description: string
  videosPerMonth: number
  features: string[]
  cta: string
  popular: boolean
}

export interface PlatformAccount {
  id: string
  platform: Platform
  name: string
  handle: string
  avatar?: string
  connected: boolean
  subscribers?: number
}

export interface UserProfile {
  id: string
  email: string
  name: string
  avatar?: string
  plan: 'free' | 'basic' | 'standard' | 'premium'
  videosRemaining: number
  trialEndsAt?: Date
}
