"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  useAdminBookings,
  useAdminCategories,
  useAdminUsers,
} from "@/features/admin/hooks"
import { Calendar, FolderKanban, Users } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useState } from "react"

export default function AdminHomePage() {
  const [page, setPage] = useState(1)
  const { data: users, isLoading: usersLoading } = useAdminUsers(page)
  const { data: bookings, isLoading: bookingsLoading } = useAdminBookings(page)
  const { data: categories, isLoading: categoriesLoading } =
    useAdminCategories()

  if (usersLoading || bookingsLoading || categoriesLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const stats = [
    {
      title: "People",
      value: users?.data?.length ?? 0,
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Bookings",
      value: bookings?.data?.length ?? 0,
      icon: Calendar,
      href: "/admin/bookings",
    },
    {
      title: "Catalog",
      value: categories?.length ?? 0,
      icon: FolderKanban,
      href: "/admin/categories",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-5xl p-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Platform health at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition hover:shadow-md">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
