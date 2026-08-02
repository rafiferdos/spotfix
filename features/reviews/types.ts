export interface CreateReviewPayload {
  bookingId: string
  rating: number
  comment?: string
}

export interface ReviewType {
  id: string
  rating: number
  comment: string | null
  bookingId: string
  createdAt: string
}
