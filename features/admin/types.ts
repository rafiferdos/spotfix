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

export interface AnalyticsOverview {
  totalRevenue: number
  totalUsers: number
  totalCustomers: number
  totalTechnicians: number
  totalBookings: number
  bookingsByStatus: { status: string; count: number }[]
  revenueByMonth: { month: string; revenue: number }[]
  topCategories: { name: string; count: number }[]
}

export interface ActivityItem {
  id: string
  type: "booking" | "payment" | "registration"
  message: string
  timestamp: string
}

export interface AdminReviewType {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  booking: {
    service: { title: string }
    customer: { name: string; email: string }
    technician: { name: string; email: string }
  }
}
