// features/admin/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { sileo } from "sileo"
import {
  banUser,
  createCategory,
  getAdminCategories,
  getAllBookingsAdmin,
  getAllUsers,
} from "./api"
import { CreateCategoryPayload } from "./types"

interface ErrorResponse {
  message: string
}

export const useAdminUsers = () =>
  useQuery({ queryKey: ["admin", "users"], queryFn: getAllUsers })
export const useAdminBookings = () =>
  useQuery({ queryKey: ["admin", "bookings"], queryFn: getAllBookingsAdmin })
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
    mutationFn: (id: string) => banUser(id),
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
