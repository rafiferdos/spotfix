import { axiosInstance } from "@/lib/axios"
import { CreateServicePayload, PaginatedServices } from "./types"

export const getServices = async (
  params?: Record<string, string | number | boolean>
): Promise<PaginatedServices> => {
  const response = await axiosInstance.get("/services", { params })
  return { data: response.data.data, meta: response.data.meta }
}

export const createService = async (payload: CreateServicePayload) => {
  const response = await axiosInstance.post("/services", payload)
  return response.data.data
}

export const deleteService = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/services/${id}`)
}
