"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  useMyTechnicianProfile,
  useTechnicianBookings,
} from "@/features/technician-dashboard/hooks"
import { useAuth } from "@/store/use-auth"
import { Briefcase, CalendarClock, ListChecks } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"

export default function TechnicianHomePage() {
  const { user } = useAuth()
  const { data: profile, isLoading: profileLoading } = useMyTechnicianProfile()
  const { data: bookings, isLoading: bookingsLoading } = useTechnicianBookings()

  if (profileLoading || bookingsLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const pending = bookings?.filter((b) => b.status === "REQUESTED").length ?? 0
  const active =
    bookings?.filter((b) => ["PAID", "IN_PROGRESS"].includes(b.status))
      .length ?? 0

  const stats = [
    {
      title: "Pending Requests",
      value: pending,
      icon: ListChecks,
      href: "/technician/bookings",
    },
    {
      title: "Active Jobs",
      value: active,
      icon: Briefcase,
      href: "/technician/bookings",
    },
    {
      title: "Schedule Slots",
      value: profile?.availabilitySlots.length ?? 0,
      icon: CalendarClock,
      href: "/technician/availability",
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
        <h1 className="text-2xl font-medium tracking-[-0.02em]">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening today.
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
