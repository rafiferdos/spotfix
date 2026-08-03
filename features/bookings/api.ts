import { axiosInstance } from "@/lib/axios"
import { BookingType, CreateBookingPayload } from "./types"

export const getMyBookings = async (): Promise<BookingType[]> => {
  const response = await axiosInstance.get("/bookings")
  return response.data.data
}

export const getBookingById = async (id: string): Promise<BookingType> => {
  const response = await axiosInstance.get(`/bookings/${id}`)
  return response.data.data
}

export const createBooking = async (
  payload: CreateBookingPayload
): Promise<BookingType> => {
  const response = await axiosInstance.post("/bookings", payload)
  return response.data.data
}

export const cancelBooking = async (id: string): Promise<BookingType> => {
  const response = await axiosInstance.patch(`/bookings/${id}/cancel`)
  return response.data.data
}
