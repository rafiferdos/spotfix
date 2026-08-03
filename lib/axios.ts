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

    console.log(`[Axios Debug] API Request Failed: ${originalRequest?.url}`)
    console.log(
      `[Axios Debug] Status: ${error.response?.status}, isMeCheck: ${isMeCheck}, isRefreshCall: ${isRefreshCall}`
    )

    if (
      error.response?.status === status.UNAUTHORIZED &&
      !isRefreshCall &&
      !isLoginCall &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true

      console.log(
        "[Axios Debug] 401 Unauthorized detected. Attempting to refresh token..."
      )
      const refreshed = await refreshAccessToken()

      console.log(`[Axios Debug] Token refresh result: ${refreshed}`)

      if (refreshed) {
        console.log(
          "[Axios Debug] Token refreshed successfully. Retrying original request."
        )
        return axiosInstance(originalRequest)
      }

      console.log(
        "[Axios Debug] Token refresh failed or no token available. Clearing auth state."
      )
      // লগআউট স্টেট সবসময় ক্লিয়ার হবে
      useAuth.getState().logout()

      // রিডাইরেক্ট লজিকটি অবশ্যই !isMeCheck এর ভেতরে থাকতে হবে
      if (!isMeCheck) {
        console.log(
          "[Axios Debug] Not an initial /auth/me call. Triggering error toast and hard redirect."
        )

        sileo.error({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
        })

        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          console.log(
            `[Axios Debug] Redirecting from ${window.location.pathname} to /login`
          )
          window.location.href = "/login"
        }
      } else {
        console.log(
          "[Axios Debug] Silent Fail: It was just a /auth/me check for a public page. Redirect prevented."
        )
      }
    }

    return Promise.reject(error)
  }
)
