// features/admin/api.ts
import { axiosInstance } from "@/lib/axios"
import {
  AdminBooking,
  AdminCategory,
  AdminUser,
  CreateCategoryPayload,
} from "./types"

export const getAllUsers = async (): Promise<AdminUser[]> => {
  const res = await axiosInstance.get("/admin/users")
  return res.data.data
}

export const banUser = async (id: string): Promise<AdminUser> => {
  const res = await axiosInstance.patch(`/admin/users/${id}`)
  return res.data.data
}

export const getAllBookingsAdmin = async (): Promise<AdminBooking[]> => {
  const res = await axiosInstance.get("/admin/bookings")
  return res.data.data
}

export const getAdminCategories = async (): Promise<AdminCategory[]> => {
  const res = await axiosInstance.get("/admin/categories")
  return res.data.data
}

export const createCategory = async (
  payload: CreateCategoryPayload
): Promise<AdminCategory> => {
  const res = await axiosInstance.post("/admin/categories", payload)
  return res.data.data
}
