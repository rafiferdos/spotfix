"use server"

import { cookies } from "next/headers"

export const loginAction = async (email: string, password: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  })

  const result = await res.json()

  if (result.success && result.data?.accessToken && result.data?.refreshToken) {
    const cookieStore = await cookies()

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      maxAge: 15 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  }

  return result
}

export const googleLoginAction = async (credential: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
    cache: "no-store",
  })

  const result = await res.json()

  if (result.success && result.data?.accessToken && result.data?.refreshToken) {
    const cookieStore = await cookies()

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      maxAge: 15 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  }

  return result
}

export const logoutAction = async () => {
  const cookieStore = await cookies()
  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")
}
