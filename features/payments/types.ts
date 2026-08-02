export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED"

export interface PaymentBookingService {
  id: string
  title: string
  price: number
}

export interface PaymentBookingTechnician {
  id: string
  name: string
  email: string
}

export interface PaymentBooking {
  id: string
  status: string
  scheduleDate: string
  service: PaymentBookingService
  technician: PaymentBookingTechnician
}

export interface PaymentType {
  id: string
  transactionId: string
  bookingId: string
  amount: number
  provider: string
  status: PaymentStatus
  paidAt: string | null
  createdAt: string
  booking: PaymentBooking
}

export interface CheckoutSession {
  paymentUrl: string
}
