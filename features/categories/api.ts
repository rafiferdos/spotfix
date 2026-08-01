import { axiosInstance } from "@/lib/axios"
import { CategoryType } from "./types"

export const getCategories = async (): Promise<CategoryType[]> => {
  const response = await axiosInstance.get("/categories")
  return response.data.data
}
