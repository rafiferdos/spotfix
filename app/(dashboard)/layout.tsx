import RoleGuard from "@/components/guards/role-guard"
import { USER_ROLES } from "@/lib/constants"

export default function GlobalDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Only logged-in users can enter the (dashboard) group
    <RoleGuard
      allowedRoles={[
        USER_ROLES.ADMIN,
        USER_ROLES.TECHNICIAN,
        USER_ROLES.CUSTOMER,
      ]}
    >
      {children}
    </RoleGuard>
  )
}
