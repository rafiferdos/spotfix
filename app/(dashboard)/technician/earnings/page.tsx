"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useTechnicianEarnings } from "@/features/technician-dashboard/hooks"
import { Briefcase, Clock, Wallet } from "lucide-react"
import { motion } from "motion/react"

export default function TechnicianEarningsPage() {
  const { data, isLoading } = useTechnicianEarnings()

  if (isLoading || !data) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const maxMonthly = Math.max(...data.earningsByMonth.map((m) => m.earnings), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-5xl p-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">Earnings</h1>
        <p className="mt-1 text-muted-foreground">
          Track your income and completed jobs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              ৳{data.totalEarnings.toFixed(0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Jobs
            </CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{data.completedJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active / Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{data.pendingPayoutJobs}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-6">
        <h2 className="mb-6 font-medium">Last 6 Months</h2>
        <div className="flex h-40 items-end gap-3">
          {data.earningsByMonth.map((m) => (
            <div
              key={m.month}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-lg bg-primary transition-all"
                  style={{
                    height: `${Math.max((m.earnings / maxMonthly) * 100, 2)}%`,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {data.topServices.length > 0 && (
        <div className="mt-6 rounded-2xl border bg-card p-6">
          <h2 className="mb-4 font-medium">Top Earning Services</h2>
          <div className="grid gap-3">
            {data.topServices.map((s) => (
              <div
                key={s.title}
                className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.count} job{s.count === 1 ? "" : "s"}
                  </p>
                </div>
                <p className="font-medium text-primary">
                  ৳{s.revenue.toFixed(0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
