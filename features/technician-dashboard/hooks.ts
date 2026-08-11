import { BookingStatus } from "@/features/bookings/types"
import { useAuth } from "@/store/use-auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { sileo } from "sileo"
import {
  getMyTechnicianProfile,
  getTechnicianBookings,
  getTechnicianEarnings,
  updateTechnicianAvailability,
  updateTechnicianBookingStatus,
  upsertTechnicianProfile,
} from "./api"
import { AvailabilityPayload, TechnicianProfilePayload } from "./types"

interface ErrorResponse {
  message: string
}

export const useMyTechnicianProfile = () => {
  const userId = useAuth((s) => s.user?.id)
  return useQuery({
    queryKey: ["technician", "me", userId],
    queryFn: () => getMyTechnicianProfile(userId as string),
    enabled: !!userId,
  })
}

export const useUpsertTechnicianProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<TechnicianProfilePayload>) =>
      upsertTechnicianProfile(payload),
    onSuccess: () => {
      sileo.success({ title: "Profile updated" })
      queryClient.invalidateQueries({ queryKey: ["technician", "me"] })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Update failed",
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AvailabilityPayload) =>
      updateTechnicianAvailability(payload),
    onSuccess: () => {
      sileo.success({ title: "Availability updated" })
      queryClient.invalidateQueries({ queryKey: ["technician", "me"] })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Update failed",
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useTechnicianBookings = () =>
  useQuery({
    queryKey: ["technician", "bookings"],
    queryFn: getTechnicianBookings,
  })

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      updateTechnicianBookingStatus(id, status),
    onSuccess: () => {
      sileo.success({ title: "Booking updated" })
      queryClient.invalidateQueries({ queryKey: ["technician", "bookings"] })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Update failed",
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useTechnicianEarnings = () =>
  useQuery({
    queryKey: ["technician", "earnings"],
    queryFn: getTechnicianEarnings,
  })
