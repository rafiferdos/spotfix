import { AppSidebar } from "@/components/app-sidebar"
import RoleGuard from "@/components/guards/role-guard"
import { NotificationBell } from "@/components/notification-bell"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { USER_ROLES } from "@/lib/constants"

export default function GlobalDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard
      allowedRoles={[
        USER_ROLES.ADMIN,
        USER_ROLES.TECHNICIAN,
        USER_ROLES.CUSTOMER,
      ]}
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <NotificationBell />
          </header>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </RoleGuard>
  )
}
