import { axiosInstance } from "@/lib/axios"
import { CheckoutSession, PaymentType } from "./types"

export const getMyPayments = async (): Promise<PaymentType[]> => {
  const response = await axiosInstance.get("/payments")
  return response.data.data
}

export const getPaymentById = async (id: string): Promise<PaymentType> => {
  const response = await axiosInstance.get(`/payments/${id}`)
  return response.data.data
}

export const createCheckoutSession = async (
  bookingId: string
): Promise<CheckoutSession> => {
  const response = await axiosInstance.post("/payments/create", { bookingId })
  return response.data.data
}
