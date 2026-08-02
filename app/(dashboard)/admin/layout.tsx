import RoleGuard from "@/components/guards/role-guard"
import { USER_ROLES } from "@/lib/constants"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>{children}</RoleGuard>
}
