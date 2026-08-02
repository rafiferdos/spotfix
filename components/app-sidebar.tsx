"use client"

import Logo from "@/assets/logo/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { UserMenu } from "@/components/user-menu"
import { useAuth, User } from "@/store/use-auth"
import { LayoutDashboard, Search, Wrench } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS: Record<
  User["role"],
  { title: string; href: string; icon: typeof LayoutDashboard }[]
> = {
  CUSTOMER: [
    { title: "Overview", href: "/customer", icon: LayoutDashboard },
    { title: "Browse Services", href: "/services", icon: Search },
    { title: "Technicians", href: "/technicians", icon: Wrench },
  ],
  TECHNICIAN: [
    { title: "Overview", href: "/technician", icon: LayoutDashboard },
  ],
  ADMIN: [{ title: "Overview", href: "/admin", icon: LayoutDashboard }],
}

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  const items = NAV_ITEMS[user.role]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center px-2 py-1">
          <Logo className="h-5 w-auto" />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <UserMenu context="dashboard" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
