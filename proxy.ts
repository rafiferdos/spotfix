// proxy.ts
import { jwtVerify } from "jose"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getNewAccessToken } from "./service/refresh-token"

const AUTH_ROUTES = ["/login", "/register"]
const PUBLIC_ROUTES = ["/", "/news", "/services"] // Added /services for platform scalability

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Initializing the response object to securely inject cookies later
  const response = NextResponse.next()

  let accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value

  let userRole = null
  let isTokenValid = false

  // Using TextEncoder for jose compatibility in Edge
  const accessSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET)
  const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET)

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, accessSecret)
      userRole = payload.role as string
      isTokenValid = true
    } catch (error) {
      isTokenValid = false
    }
  }

  // Silent Token Refresh Logic
  if (!isTokenValid && refreshToken) {
    try {
      await jwtVerify(refreshToken, refreshSecret)
      const result = await getNewAccessToken()

      if (result?.success) {
        const newAccessToken = result.data.accessToken

        // Attaching the new cookie strictly to the NextResponse object
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
      }
    } catch (error) {
      response.cookies.delete("accessToken")
      response.cookies.delete("refreshToken")
    }
  }

  // Unauthenticated User Cleanup
  if (!isTokenValid) {
    response.cookies.delete("accessToken")
  }

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  // Redirect authenticated users away from auth pages
  if (isTokenValid && isAuthRoute) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url))
    }
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Protect private routes
  if (!isTokenValid && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based Access Control (RBAC)
  if (pathname.startsWith("/dashboard") && userRole !== "USER") {
    return NextResponse.redirect(new URL("/not-found", request.url))
  }
  if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
