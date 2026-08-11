export interface ProfileUser {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  profileImage: string | null
  role: "ADMIN" | "CUSTOMER" | "TECHNICIAN"
  status: string
}

export interface UpdateProfilePayload {
  name?: string
  phone?: string
  address?: string
}

export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}
