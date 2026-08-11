import { axiosInstance } from "@/lib/axios"
import {
  CreateReviewPayload,
  MyReviewType,
  ReviewType,
  TechnicianReviewsResponse,
  UpdateReviewPayload,
} from "./types"

export const createReview = async (
  payload: CreateReviewPayload
): Promise<ReviewType> => {
  const response = await axiosInstance.post("/reviews", payload)
  return response.data.data
}

export const getMyReviews = async (): Promise<MyReviewType[]> => {
  const response = await axiosInstance.get("/reviews/me")
  return response.data.data
}

export const updateReview = async (
  id: string,
  payload: UpdateReviewPayload
): Promise<ReviewType> => {
  const response = await axiosInstance.patch(`/reviews/${id}`, payload)
  return response.data.data
}

export const getTechnicianReviews =
  async (): Promise<TechnicianReviewsResponse> => {
    const response = await axiosInstance.get("/reviews/technician/me")
    return response.data.data
  }
