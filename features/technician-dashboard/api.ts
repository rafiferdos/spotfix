import { BookingStatus, BookingType } from "@/features/bookings/types"
import { TechnicianProfileDetail } from "@/features/technicians/types"
import { axiosInstance } from "@/lib/axios"
import { AvailabilityPayload, TechnicianProfilePayload } from "./types"

export const getMyTechnicianProfile = async (
  userId: string
): Promise<TechnicianProfileDetail | null> => {
  try {
    const res = await axiosInstance.get(`/technicians/${userId}`)
    return res.data.data
  } catch {
    return null
  }
}

export const upsertTechnicianProfile = async (
  payload: Partial<TechnicianProfilePayload>
) => {
  const res = await axiosInstance.put("/technician/profile", payload)
  return res.data.data
}

export const updateTechnicianAvailability = async (
  payload: AvailabilityPayload
) => {
  const res = await axiosInstance.put("/technician/availability", payload)
  return res.data.data
}

export const getTechnicianBookings = async (): Promise<BookingType[]> => {
  const res = await axiosInstance.get("/technician/bookings")
  return res.data.data
}

export const updateTechnicianBookingStatus = async (
  id: string,
  status: BookingStatus
) => {
  const res = await axiosInstance.patch(`/technician/bookings/${id}`, {
    status,
  })
  return res.data.data
}
