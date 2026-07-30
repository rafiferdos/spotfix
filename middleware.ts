import { jwtDecode } from "jwt-decode"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const AUTH_ROUTES = ["/login", "/register"]
const PUBLIC_ROUTES = ["/", "/services", "/technicians"]

interface CustomJwtPayload {
  role: "customer" | "technician" | "admin"
  userId: string
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("accessToken")?.value

  let userRole: string | null = null

  if (accessToken) {
    try {
      // jwt-decode works perfectly in Edge Runtime
      const decodedData = jwtDecode<CustomJwtPayload>(accessToken)
      userRole = decodedData.role
    } catch (error) {
      console.error("Error decoding token in middleware", error)
      // Token invalid, clear it
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("accessToken")
      return response
    }
  }

  // 1. Prevent authenticated users from accessing auth pages
  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url))
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )
  const isAuthRoute = AUTH_ROUTES.includes(pathname)

  // 2. Protect private routes
  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 3. Role-based Dashboard Protection
  if (pathname.startsWith("/dashboard")) {
    if (pathname.startsWith("/dashboard/customer") && userRole !== "customer") {
      return NextResponse.redirect(new URL("/not-found", request.url))
    }
    if (
      pathname.startsWith("/dashboard/technician") &&
      userRole !== "technician"
    ) {
      return NextResponse.redirect(new URL("/not-found", request.url))
    }
    if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/not-found", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
