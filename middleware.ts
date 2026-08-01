import { jwtVerify } from "jose"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getNewAccessToken } from "./service/refresh-token"

const AUTH_ROUTES = ["/login", "/register"]
const PUBLIC_ROUTES = ["/", "/news", "/services"]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const response = NextResponse.next()

  let accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value

  let userRole = null
  let isTokenValid = false

  const accessSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET)

  // 1. Check if Access Token is valid
  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, accessSecret)
      userRole = payload.role as string
      isTokenValid = true
    } catch (error) {
      isTokenValid = false
    }
  }

  // 2. Silent Token Refresh (Let the Backend verify the refresh token securely)
  if (!isTokenValid && refreshToken) {
    try {
      const result = await getNewAccessToken(refreshToken)

      if (result?.success && result?.data?.accessToken) {
        const newAccessToken = result.data.accessToken

        response.cookies.set("accessToken", newAccessToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24, // 1 day
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        })

        accessToken = newAccessToken
        const { payload } = await jwtVerify(newAccessToken, accessSecret)
        userRole = payload.role as string
        isTokenValid = true
      } else {
        // Only delete if backend explicitly says the refresh token is invalid
        response.cookies.delete("accessToken")
        response.cookies.delete("refreshToken")
      }
    } catch (error) {
      // Network or fetch failure, do not blindly destroy cookies
      console.error("Token refresh failed in proxy:", error)
    }
  }

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  const redirectTo = (url: string) => {
    const redirectResponse = NextResponse.redirect(new URL(url, request.url))
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // Redirect authenticated users away from auth pages
  if (isTokenValid && isAuthRoute) {
    if (userRole === "ADMIN") {
      return redirectTo("/admin-dashboard")
    }
    return redirectTo("/dashboard")
  }

  // Protect private routes
  if (!isTokenValid && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirectTo", pathname)

    const loginRedirectResponse = NextResponse.redirect(loginUrl)
    response.cookies.getAll().forEach((cookie) => {
      loginRedirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return loginRedirectResponse
  }

  // Role-based Access Control (RBAC)
  if (pathname.startsWith("/dashboard") && userRole !== "USER") {
    return redirectTo("/not-found")
  }
  if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return redirectTo("/not-found")
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
