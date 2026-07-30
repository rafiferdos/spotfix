import { axiosInstance } from "@/lib/axios"

export interface ServiceType {
  id: string
  name: string
  description: string
  price: number
  category: string
  isAvailable: boolean
}

export const getServices = async (): Promise<ServiceType[]> => {
  const response = await axiosInstance.get("/services")
  return response.data.data
}

export const createService = async (paylaod: Omit<ServiceType, "id">) => {
  const response = await axiosInstance.post("/services", paylaod)
  return response.data.data
}
