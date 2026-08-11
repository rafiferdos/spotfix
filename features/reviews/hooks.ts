import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { sileo } from "sileo"
import {
  createReview,
  getMyReviews,
  getTechnicianReviews,
  updateReview,
} from "./api"
import { CreateReviewPayload, UpdateReviewPayload } from "./types"

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

export const useMyReviews = () =>
  useQuery({ queryKey: ["reviews", "me"], queryFn: getMyReviews })

export const useUpdateReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateReviewPayload
    }) => updateReview(id, payload),
    onSuccess: () => {
      sileo.success({ title: "Review updated" })
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Update failed",
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useTechnicianReviews = () =>
  useQuery({
    queryKey: ["reviews", "technician", "me"],
    queryFn: getTechnicianReviews,
  })
