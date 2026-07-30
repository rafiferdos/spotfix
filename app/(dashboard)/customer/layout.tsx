import RoleGuard from "@/components/guards/role-guard"
import { USER_ROLES } from "@/lib/constants"

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.CUSTOMER]}>
      <div className="flex h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
          {children}
        </main>
      </div>
    </RoleGuard>
  )
}
