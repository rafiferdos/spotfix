import { jwtVerify } from "jose"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getNewAccessToken } from "./service/refresh-token"

const AUTH_ROUTES = ["/login", "/register"]
const PUBLIC_ROUTES = [
  "/",
  "/services",
  "/technicians",
  "/payment/success",
  "/payment/cancel",
  "/about",
  "/privacy",
]
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
    } catch (err) {
      console.error("[proxy] accessToken verify failed:", err)

      isTokenValid = false
    }
  }

  // 2. Silent Token Refresh
  if (!isTokenValid && refreshToken) {
    try {
      const result = await getNewAccessToken(refreshToken)

      if (result?.success && result?.data?.accessToken) {
        const newAccessToken = result.data.accessToken

        response.cookies.set({
          name: "accessToken",
          value: newAccessToken,
          httpOnly: true,
          maxAge: 60 * 60 * 24,
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
      console.error("Token refresh failed in middleware:", error)
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
    return redirectTo(loginUrl.toString())
  }

  // Role-based Access Control — skip entirely for public routes,
  // and use exact-boundary matching so "/technicians" never matches "/technician"
  if (!isPublicRoute) {
    const isExactOrNested = (base: string) =>
      pathname === base || pathname.startsWith(base + "/")

    if (isExactOrNested("/customer") && userRole !== "CUSTOMER") {
      return redirectTo("/not-found")
    }
    if (isExactOrNested("/technician") && userRole !== "TECHNICIAN") {
      return redirectTo("/not-found")
    }
    if (isExactOrNested("/admin") && userRole !== "ADMIN") {
      return redirectTo("/not-found")
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
