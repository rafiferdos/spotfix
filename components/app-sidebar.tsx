"use client"

import Logo from "@/assets/logo/spotfix.png"
import { LogoutDialog } from "@/components/logout-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useAuth, User } from "@/store/use-auth"
import {
  Briefcase,
  Calendar,
  CalendarClock,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Search,
  UserRound,
  Users,
  Wrench,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { UserAvatar } from "./user-avatar"

const NAV_ITEMS: Record<
  User["role"],
  { title: string; href: string; icon: typeof LayoutDashboard }[]
> = {
  CUSTOMER: [
    { title: "Home", href: "/customer", icon: LayoutDashboard },
    { title: "Browse Services", href: "/services", icon: Search },
    { title: "Technicians", href: "/technicians", icon: Wrench },
    { title: "Profile", href: "/profile", icon: UserRound },
  ],
  TECHNICIAN: [
    { title: "Home", href: "/technician", icon: LayoutDashboard },
    { title: "Profile", href: "/technician/profile", icon: UserRound },
    { title: "Account", href: "/profile", icon: UserRound },
    { title: "Services", href: "/technician/services", icon: Wrench },
    {
      title: "Schedule",
      href: "/technician/availability",
      icon: CalendarClock,
    },
    { title: "Jobs", href: "/technician/bookings", icon: Briefcase },
  ],
  ADMIN: [
    { title: "Home", href: "/admin", icon: LayoutDashboard },
    { title: "People", href: "/admin/users", icon: Users },
    { title: "Bookings", href: "/admin/bookings", icon: Calendar },
    { title: "Catalog", href: "/admin/categories", icon: FolderKanban },
    { title: "Profile", href: "/profile", icon: UserRound },
  ],
}

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [logoutOpen, setLogoutOpen] = useState(false)

  if (!user) return null

  const items = NAV_ITEMS[user.role]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center px-2 py-1">
          <div className="mx-auto rounded-3xl bg-primary/10 p-7 dark:bg-primary/80">
            <Image
              src={Logo}
              alt="Spotfix Logo"
              width={32}
              height={32}
              className="mr-2"
            />
          </div>
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Log out"
              onClick={() => setLogoutOpen(true)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="flex items-center justify-between px-3 py-1.5 text-sm text-sidebar-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <span className="group-data-[collapsible=icon]:hidden">
            Appearance
          </span>
          <ThemeToggle />
        </div>

        <SidebarSeparator />

        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            <UserAvatar
              src={user.profileImage}
              name={user.name}
              className="h-9 w-9 text-sm"
            />
          </div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />

      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </Sidebar>
  )
}
