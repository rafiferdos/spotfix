"use client"

import { useAuth, User } from "@/store/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Spinner } from "../ui/spinner"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: User["role"][]
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      router.replace("/login")
    } else if (!allowedRoles.includes(user?.role as User["role"])) {
      router.replace("/unauthorized")
    }
  }, [isLoading, user, allowedRoles, router])

  const isAuthorized =
    !isLoading && user && allowedRoles.includes(user.role as User["role"])

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }
  return <>{children}</>
}
