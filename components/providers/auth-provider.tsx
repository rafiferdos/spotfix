"use client"

import { useAuth } from "@/store/use-auth"
import axios from "axios"
import { useEffect } from "react"

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { login, logout, setLoading } = useAuth()

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const response = await axios.get("/auth/me")

        if (response.data.success && response.data.data) {
          login(response.data.data)
        } else {
          logout()
        }
      } catch (error) {
        // If 401/403 or network error occurs, clear the state
        logout()
      } finally {
        setLoading(false)
      }
    }

    hydrateUser()
  }, [login, logout, setLoading])

  return <>{children}</>
}
