import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { sileo } from "sileo"
import { createReview } from "./api"
import { CreateReviewPayload } from "./types"

interface ErrorResponse {
  message: string
}

export const useCreateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: () => {
      sileo.success({
        title: "Review submitted",
        description: "Thanks for your feedback!",
      })
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Review failed",
        description:
          error.response?.data?.message ||
          "Something went wrong while submitting your review.",
      })
    },
  })
}
