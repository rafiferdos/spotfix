import axios from "axios"
import status from "http-status"
import { sileo } from "sileo"

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor for handling global client-side errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === status.UNAUTHORIZED) {
      sileo.error({
        title: "Unauthorized Access",
        description:
          "Your session may have expired. Please log in again to continue.",
      })
      console.error("Unauthorized access - maybe token expired")
    }
    return Promise.reject(error)
  }
)
