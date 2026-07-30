"use server"

import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { sileo } from "sileo"

/**
 * Gets a new Access Token.
 * @param tokenFromProxy - Pass the token manually when calling from proxy.ts (Edge runtime)
 */
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
  } catch (error) {
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

/**
 * Validates the token strictly for Server Components (e.g., page.tsx, layout.tsx)
 * proxy.ts-এর জন্য এটি প্রয়োজন নেই, কারণ proxy নিজেই টোকেন ভ্যালিডেট করে।
 */
export const isAccessTokenExist = async () => {
  const cookieStore = await cookies()
  let accessToken = cookieStore.get("accessToken")?.value || null
  const refreshToken = cookieStore.get("refreshToken")?.value || null

  // Error থ্রো করার বদলে null রিটার্ন করা সেইফ, যাতে UI ক্র্যাশ না করে স্মুথলি রিডাইরেক্ট হতে পারে।
  if (!accessToken && !refreshToken) {
    return null
  }

  const accessSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET)
  const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET)

  let isAccessTokenValid = false
  let isRefreshTokenValid = false

  // jose প্যাকেজ ব্যবহার করে Edge-safe Token Verification
  if (accessToken) {
    try {
      await jwtVerify(accessToken, accessSecret)
      isAccessTokenValid = true
    } catch (error) {
      isAccessTokenValid = false
    }
  }

  if (refreshToken) {
    try {
      await jwtVerify(refreshToken, refreshSecret)
      isRefreshTokenValid = true
    } catch (error) {
      isRefreshTokenValid = false
    }
  }

  // Access token এক্সপায়ার্ড কিন্তু Refresh token ভ্যালিড থাকলে নতুন টোকেন ফেচ করা
  if (!isAccessTokenValid && isRefreshTokenValid) {
    const result = await getNewAccessToken(refreshToken)

    if (result?.success && result?.data?.accessToken) {
      const newAccessToken = result.data.accessToken

      // নতুন টোকেন কুকিতে সেট করা
      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
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
