// features/admin/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { sileo } from "sileo"
import {
  banUser,
  createCategory,
  deleteAdminReview,
  deleteCategory,
  getAdminCategories,
  getAdminReviews,
  getAllBookingsAdmin,
  getAllUsers,
  getAnalyticsActivity,
  getAnalyticsOverview,
  unbanUser,
} from "./api"
import { CreateCategoryPayload } from "./types"

interface ErrorResponse {
  message: string
}

export const useAdminUsers = (page: number, limit = 10) =>
  useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => getAllUsers(page, limit),
    placeholderData: (prev) => prev,
  })

export const useAdminBookings = (page: number, limit = 10) =>
  useQuery({
    queryKey: ["admin", "bookings", page],
    queryFn: () => getAllBookingsAdmin(page, limit),
    placeholderData: (prev) => prev,
  })

export const useAdminCategories = () =>
  useQuery({ queryKey: ["admin", "categories"], queryFn: getAdminCategories })

export const useBanUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => banUser(id),
    onSuccess: () => {
      sileo.success({ title: "User banned" })
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Failed to ban user",
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useUnbanUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unbanUser(id),
    onSuccess: () => {
      sileo.success({ title: "User unbanned" })
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Failed to unban user",
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: () => {
      sileo.success({ title: "Category created" })
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] })
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Failed to create category",
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      sileo.success({ title: "Category deleted" })
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] })
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Failed to delete category",
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useAnalyticsOverview = () =>
  useQuery({
    queryKey: ["admin", "analytics", "overview"],
    queryFn: getAnalyticsOverview,
  })

export const useAnalyticsActivity = () =>
  useQuery({
    queryKey: ["admin", "analytics", "activity"],
    queryFn: getAnalyticsActivity,
  })

export const useAdminReviews = () =>
  useQuery({ queryKey: ["admin", "reviews"], queryFn: getAdminReviews })

export const useDeleteAdminReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminReview(id),
    onSuccess: () => {
      sileo.success({ title: "Review deleted" })
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Delete failed",
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}
