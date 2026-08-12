export interface ServiceCategory {
  name: string
}

export interface ServiceTechnician {
  name: string
  address: string | null
  profileImage: string | null
}

export interface ServiceType {
  id: string
  title: string
  description: string
  price: number
  technicianId: string
  categoryId: string
  category: ServiceCategory
  technician: ServiceTechnician
  createdAt: string
  updatedAt: string
}

export interface CreateServicePayload {
  title: string
  description: string
  price: number
  technicianId: string
  categoryId: string
}

export interface PaginatedServices {
  data: ServiceType[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}
