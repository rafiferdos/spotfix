"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { sileo } from "sileo"

export const getMe = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    sileo.error({
      title: "User not logged in",
      description:
        "No access token found in cookies. Please log in to continue.",
    })
    return { success: false, message: "User not logged in!" }
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Adjust based on your backend expectation
      },
      cache: "no-store", // Recommended for user specific data
    })

    const result = await res.json()
    return { success: true, data: result }
  } catch (error) {
    sileo.error({
      title: "Failed to fetch user data",
      description:
        error instanceof Error ? error.message : "An unknown error occurred",
    })
    return { success: false, message: "Failed to fetch user data" }
  }
}

export const logout = async () => {
  const cookieStore = await cookies()
  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")

  redirect("/login")
}
