export interface AdminUser {
  id: string
  name: string
  email: string
  phone: string | null
  role: "ADMIN" | "CUSTOMER" | "TECHNICIAN"
  status: "ACTIVE" | "BANNED"
  address: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminBooking {
  id: string
  customerId: string
  technicianId: string
  serviceId: string
  status: string
  scheduleDate: string
  createdAt: string
  updatedAt: string
}

export interface AdminCategory {
  id: string
  name: string
  description: string | null
}

export interface CreateCategoryPayload {
  name: string
  description: string
}
