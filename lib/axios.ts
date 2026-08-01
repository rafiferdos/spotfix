import config from "@/config"
import { useAuth } from "@/store/use-auth"
import axios from "axios"
import status from "http-status"
import { sileo } from "sileo"

export const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isMeCheck = error.config?.url?.includes("/auth/me")

    if (error.response?.status === status.UNAUTHORIZED && !isMeCheck) {
      sileo.error({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
      })

      useAuth.getState().logout()

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)