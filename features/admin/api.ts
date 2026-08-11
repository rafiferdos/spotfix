// features/admin/api.ts
import { axiosInstance } from "@/lib/axios"
import {
  ActivityItem,
  AdminBooking,
  AdminCategory,
  AdminReviewType,
  AdminUser,
  AnalyticsOverview,
  CreateCategoryPayload,
} from "./types"

export const getAllUsers = async (): Promise<AdminUser[]> => {
  const res = await axiosInstance.get("/admin/users")
  return res.data.data
}

export const banUser = async (id: string): Promise<AdminUser> => {
  const res = await axiosInstance.patch(`/admin/users/${id}/ban`)
  return res.data.data
}
export const unbanUser = async (id: string): Promise<AdminUser> => {
  const res = await axiosInstance.patch(`/admin/users/${id}/unban`)
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

export const deleteCategory = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/admin/categories/${id}`)
}

export const getAnalyticsOverview = async (): Promise<AnalyticsOverview> => {
  const res = await axiosInstance.get("/admin/analytics/overview")
  return res.data.data
}

export const getAnalyticsActivity = async (): Promise<ActivityItem[]> => {
  const res = await axiosInstance.get("/admin/analytics/activity")
  return res.data.data
}

export const getAdminReviews = async (): Promise<AdminReviewType[]> => {
  const res = await axiosInstance.get("/admin/reviews")
  return res.data.data
}

export const deleteAdminReview = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/admin/reviews/${id}`)
}
