export type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"

export interface BookingType {
  id: string
  customerId: string
  technicianId: string
  serviceId: string
  status: BookingStatus
  scheduleDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateBookingPayload {
  technicianId: string
  serviceId: string
  scheduleDate: string
}
