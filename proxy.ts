import { jwtVerify } from "jose"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getNewAccessToken } from "./service/refresh-token"

const AUTH_ROUTES = ["/login", "/register"]
const PUBLIC_ROUTES = ["/", "/news", "/services"]

export async function proxy(request: NextRequest) {
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

  console.log(accessToken, refreshToken, isTokenValid, userRole, pathname)

  // 2. Silent Token Refresh
  if (!isTokenValid && refreshToken) {
    try {
      const result = await getNewAccessToken(refreshToken)

      if (result?.success && result?.data?.accessToken) {
        const newAccessToken = result.data.accessToken

        // FIX 1: Add path explicitly to ensure global scoping
        response.cookies.set({
          name: "accessToken",
          value: newAccessToken,
          httpOnly: true,
          maxAge: 60 * 60 * 24, // 1 day
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        })

        accessToken = newAccessToken
        const { payload } = await jwtVerify(newAccessToken, accessSecret)
        userRole = payload.role as string
        isTokenValid = true
      } else {
        response.cookies.delete("accessToken")
        response.cookies.delete("refreshToken")
      }
    } catch (error) {
      console.error("Token refresh failed in proxy:", error)
    }
  }

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  // FIX 2: Securely copy all cookie attributes without destructing them
  const redirectTo = (url: string) => {
    const redirectResponse = NextResponse.redirect(new URL(url, request.url))

    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path ?? "/",
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
        maxAge: cookie.maxAge,
        expires: cookie.expires,
      })
    })

    return redirectResponse
  }

  // Redirect authenticated users away from auth pages
  if (isTokenValid && isAuthRoute) {
    if (userRole === "ADMIN") return redirectTo("/admin")
    if (userRole === "TECHNICIAN") return redirectTo("/technician")
    return redirectTo("/customer")
  }

  // Protect private routes
  if (!isTokenValid && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirectTo", pathname)

    // FIX 3: Use the helper function here as well to retain cookies during redirection
    return redirectTo(loginUrl.toString())
  }

  // Role-based Access Control (RBAC)
  if (pathname.startsWith("/dashboard") && userRole !== "CUSTOMER") {
    return redirectTo("/not-found")
  }
  if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
    return redirectTo("/not-found")
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
