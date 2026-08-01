import { axiosInstance } from "@/lib/axios"
import {
  TechnicianFilters,
  TechnicianProfileDetail,
  TechnicianType,
} from "./types"

export const getTechnicians = async (
  params?: TechnicianFilters
): Promise<TechnicianType[]> => {
  const response = await axiosInstance.get("/technicians", { params })
  return response.data.data
}

export const getTechnicianById = async (
  id: string
): Promise<TechnicianProfileDetail> => {
  const response = await axiosInstance.get(`/technicians/${id}`)
  return response.data.data
}
