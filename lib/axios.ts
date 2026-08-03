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

let refreshPromise: Promise<boolean> | null = null

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axiosInstance
      .post("/auth/refresh-token")
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isMeCheck = originalRequest?.url?.includes("/auth/me")
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh-token")
    const isLoginCall = originalRequest?.url?.includes("/auth/login")

    if (
      error.response?.status === status.UNAUTHORIZED &&
      !isRefreshCall &&
      !isLoginCall &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true
      const refreshed = await refreshAccessToken()

      if (refreshed) {
        return axiosInstance(originalRequest)
      }

      if (!isMeCheck) {
        sileo.error({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
        })
      }

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
