import { axiosInstance } from "@/lib/axios"
import { CreateServicePayload, ServiceType } from "./types"

export const getServices = async (
  params?: Record<string, string | number | boolean>
): Promise<ServiceType[]> => {
  const response = await axiosInstance.get("/services", { params })

  return response.data.data
}

export const createService = async (payload: CreateServicePayload) => {
  const response = await axiosInstance.post("/services", payload)
  return response.data.data
}

export const deleteService = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/services/${id}`)
}
