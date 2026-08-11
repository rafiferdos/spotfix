"use client"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  useAdminReviews,
  useAnalyticsActivity,
  useAnalyticsOverview,
  useDeleteAdminReview,
} from "@/features/admin/hooks"
import { cn } from "@/lib/utils"
import {
  Activity,
  Briefcase,
  Star,
  Trash2,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"

type Tab = "overview" | "activity" | "reviews"

const TABS: { id: Tab; label: string; icon: typeof TrendingUp }[] = [
  { id: "overview", label: "Overview", icon: TrendingUp },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "reviews", label: "Reviews", icon: Star },
]

export default function AdminAnalyticsPage() {
  const [tab, setTab] = useState<Tab>("overview")

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">
          Analytics & Reports
        </h1>
        <p className="mt-1 text-muted-foreground">
          Platform performance, activity, and reviews in one place.
        </p>
      </div>

      <div className="mb-6 flex w-fit gap-1 rounded-full bg-muted p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition",
              tab === id
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab />}
      {tab === "activity" && <ActivityTab />}
      {tab === "reviews" && <ReviewsTab />}
    </div>
  )
}

function OverviewTab() {
  const { data, isLoading } = useAnalyticsOverview()

  if (isLoading || !data) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const maxMonthly = Math.max(...data.revenueByMonth.map((m) => m.revenue), 1)
  const maxCategory = Math.max(...data.topCategories.map((c) => c.count), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              ৳{data.totalRevenue.toFixed(0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{data.totalBookings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Customers
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{data.totalCustomers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Technicians
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{data.totalTechnicians}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-6 font-medium">Revenue — Last 6 Months</h2>
          <div className="flex h-40 items-end gap-3">
            {data.revenueByMonth.map((m) => (
              <div
                key={m.month}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-primary transition-all"
                    style={{
                      height: `${Math.max((m.revenue / maxMonthly) * 100, 2)}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 font-medium">Bookings by Status</h2>
          <div className="grid gap-2">
            {data.bookingsByStatus.map((b) => (
              <div key={b.status} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {b.status}
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                  {b.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.topCategories.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-card p-6">
          <h2 className="mb-4 font-medium">Top Categories</h2>
          <div className="grid gap-3">
            {data.topCategories.map((c) => (
              <div key={c.name} className="grid gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{c.name}</span>
                  <span className="text-muted-foreground">
                    {c.count} services
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(c.count / maxCategory) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

function ActivityTab() {
  const { data, isLoading } = useAnalyticsActivity()

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner />
      </div>
    )
  }
  if (!data || data.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        No recent activity.
      </p>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border bg-card p-2"
    >
      {data.map((item, i) => (
        <div
          key={item.id}
          className={cn(
            "flex items-start gap-3 px-4 py-3",
            i !== data.length - 1 && "border-b"
          )}
        >
          <span
            className={cn(
              "mt-1.5 h-2 w-2 shrink-0 rounded-full",
              item.type === "booking" && "bg-primary",
              item.type === "payment" && "bg-emerald-500",
              item.type === "registration" && "bg-blue-500"
            )}
          />
          <div className="flex-1">
            <p className="text-sm">{item.message}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </motion.div>
  )
}

function ReviewsTab() {
  const { data, isLoading } = useAdminReviews()
  const { mutate: remove, isPending } = useDeleteAdminReview()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner />
      </div>
    )
  }
  if (!data || data.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">No reviews yet.</p>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid gap-3"
    >
      {data.map((review) => (
        <div key={review.id} className="rounded-2xl border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium">{review.booking.service.title}</p>
              <p className="text-sm text-muted-foreground">
                {review.booking.customer.name} →{" "}
                {review.booking.technician.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < review.rating ? "fill-primary" : "fill-transparent"
                    )}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteTarget(review.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          {review.comment && (
            <p className="mt-2 text-sm text-foreground/90">{review.comment}</p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this review?"
        description="This will permanently remove the review. This can't be undone."
        confirmLabel="Delete"
        loading={isPending}
        onConfirm={() => {
          if (deleteTarget)
            remove(deleteTarget, { onSuccess: () => setDeleteTarget(null) })
        }}
      />
    </motion.div>
  )
}
