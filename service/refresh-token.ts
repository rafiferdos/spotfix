"use server"

import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { sileo } from "sileo"

export const getNewAccessToken = async (tokenFromProxy?: string | null) => {
  let refreshToken = tokenFromProxy

  if (!refreshToken) {
    const cookieStore = await cookies()
    refreshToken = cookieStore.get("refreshToken")?.value
  }

  if (!refreshToken) {
    return {
      success: false,
      message: "Refresh token not found!",
    }
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
        cache: "no-cache",
      }
    )

    const result = await res.json()
    return result
  } catch {
    sileo.error({
      title: "Failed to fetch new access token",
      description:
        "An error occurred while trying to refresh the access token.",
    })
    return {
      success: false,
      message: "Failed to fetch new access token",
    }
  }
}

export const isAccessTokenExist = async () => {
  const cookieStore = await cookies()
  let accessToken = cookieStore.get("accessToken")?.value || null
  const refreshToken = cookieStore.get("refreshToken")?.value || null

  if (!accessToken && !refreshToken) {
    return null
  }

  const accessSecret = new TextEncoder().encode(process.env.JWT_SECRET)
  const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET)

  let isAccessTokenValid = false
  let isRefreshTokenValid = false

  if (accessToken) {
    try {
      await jwtVerify(accessToken, accessSecret)
      isAccessTokenValid = true
    } catch {
      isAccessTokenValid = false
    }
  }

  if (refreshToken) {
    try {
      await jwtVerify(refreshToken, refreshSecret)
      isRefreshTokenValid = true
    } catch {
      isRefreshTokenValid = false
    }
  }

  if (!isAccessTokenValid && isRefreshTokenValid) {
    const result = await getNewAccessToken(refreshToken)

    if (result?.success && result?.data?.accessToken) {
      const newAccessToken = result.data.accessToken

      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 15 * 60, // 15 minutes — matches backend accessToken cookie lifetime
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })

      accessToken = newAccessToken
    } else {
      accessToken = null
    }
  } else if (!isAccessTokenValid && !isRefreshTokenValid) {
    accessToken = null
  }

  return accessToken
}
