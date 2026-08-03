import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { sileo } from "sileo"
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getMyBookings,
} from "./api"
import { CreateBookingPayload } from "./types"

interface ErrorResponse {
  message: string
}

export const useMyBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: getMyBookings,
  })
}

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
  })
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: () => {
      sileo.success({
        title: "Booking requested",
        description: "We've sent your request to the technician.",
      })
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Booking failed",
        description:
          error.response?.data?.message ||
          "Something went wrong while creating the booking.",
      })
    },
  })
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => {
      sileo.success({
        title: "Booking cancelled",
        description: "Your booking has been cancelled.",
      })
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Cancel failed",
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}
