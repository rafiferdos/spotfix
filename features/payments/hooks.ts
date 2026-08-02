import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { sileo } from "sileo"
import { createCheckoutSession, getMyPayments, getPaymentById } from "./api"

interface ErrorResponse {
  message: string
}

export const useMyPayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: getMyPayments,
  })
}

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => getPaymentById(id),
    enabled: !!id,
  })
}

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: (bookingId: string) => createCheckoutSession(bookingId),
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Payment failed to start",
        description:
          error.response?.data?.message ||
          "Could not start the checkout session. Please try again.",
      })
    },
  })
}
