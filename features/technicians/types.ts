export interface TechnicianUser {
  name: string
  address: string | null
  email: string
  profileImage: string | null
}
export interface TechnicianType {
  id: string
  userId: string
  skills: string[]
  experience: number
  pricing: number
  user: TechnicianUser
}

export interface TechnicianReview {
  id: string
  rating: number
  comment: string | null
  createdAt: string
}

export interface TechnicianBookingService {
  id: string
  title: string
  description: string
}

export interface TechnicianBookingItem {
  id: string
  status: string
  scheduleDate: string
  review: TechnicianReview | null
  service: TechnicianBookingService
}

export interface TechnicianProfileDetail {
  id: string
  skills: string[]
  availabilitySlots: string[]
  experience: number
  pricing: number
  user: {
    name: string
    email: string
    phone: string | null
    profileImage: string | null
    technician: TechnicianBookingItem[]
  }
}

export interface TechnicianFilters {
  skill?: string
  location?: string
  rating?: number
}
