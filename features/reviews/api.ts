import { axiosInstance } from "@/lib/axios"
import { CreateReviewPayload, ReviewType } from "./types"

export const createReview = async (
  payload: CreateReviewPayload
): Promise<ReviewType> => {
  const response = await axiosInstance.post("/reviews", payload)
  return response.data.data
}
