import { axiosInstance } from "@/lib/axios"
import { ServiceType } from "./types"

export const getServices = async (params?: Record<string, any>): Promise<ServiceType[]> => {
  const response = await axiosInstance.get("/services", { params });
  return response.data.data;
};
export const createService = async (paylaod: Omit<ServiceType, "id">) => {
  const response = await axiosInstance.post("/services", paylaod)
  return response.data.data
}
