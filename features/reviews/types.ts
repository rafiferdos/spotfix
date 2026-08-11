export interface CreateReviewPayload {
  bookingId: string
  rating: number
  comment?: string
}

export interface UpdateReviewPayload {
  rating?: number
  comment?: string
}

export interface ReviewType {
  id: string
  rating: number
  comment: string | null
  bookingId: string
  createdAt: string
}

export interface MyReviewType extends ReviewType {
  booking: {
    service: { title: string }
    technician: { name: string }
  }
}

export interface TechnicianReviewType extends ReviewType {
  booking: {
    service: { title: string }
    customer: { name: string }
  }
}

export interface TechnicianReviewsResponse {
  reviews: TechnicianReviewType[]
  avgRating: number
  total: number
}
