"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutAction } from "@/service/auth-actions"
import { useAuth, User } from "@/store/use-auth"
import { Home, LayoutDashboard, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { sileo } from "sileo"

const ROLE_DASHBOARD_PATH: Record<User["role"], string> = {
  ADMIN: "/admin",
  TECHNICIAN: "/technician",
  CUSTOMER: "/customer",
}

export function UserMenu({
  context = "public",
}: {
  context?: "public" | "dashboard"
}) {
  const router = useRouter()
  const { user, logout } = useAuth()

  if (!user) return null

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const handleLogout = async () => {
    await logoutAction()
    logout()
    sileo.success({ title: "Logged out", description: "See you again soon!" })
    router.push("/login")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary transition outline-none hover:bg-primary/20">
        {initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="truncate">{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {context === "public" ? (
          <DropdownMenuItem className="cursor-pointer" closeOnClick>
            <Link
              href={ROLE_DASHBOARD_PATH[user.role]}
              className="flex w-full items-center gap-2"
            >
              <LayoutDashboard />
              Dashboard
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="cursor-pointer" closeOnClick>
            <Link href="/" className="flex w-full items-center gap-2">
              <Home />
              Home
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
