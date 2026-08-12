"use client"

import { CustomerBookingCard } from "@/components/customer-booking-card"
import { PaymentDetailsDialog } from "@/components/payment-details-dialog"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useMyBookings } from "@/features/bookings/hooks"
import { useMyPayments } from "@/features/payments/hooks"
import { cn } from "@/lib/utils"
import { AlertCircle, CalendarClock, Receipt } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"

type Tab = "bookings" | "payments"

const TABS: { id: Tab; label: string; icon: typeof CalendarClock }[] = [
  { id: "bookings", label: "My Bookings", icon: CalendarClock },
  { id: "payments", label: "Payment History", icon: Receipt },
]

export default function CustomerDashboardPage() {
  const [tab, setTab] = useState<Tab>("bookings")

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">
          My Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track your bookings and payments in one place.
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

      {tab === "bookings" ? <BookingsTab /> : <PaymentsTab />}
    </div>
  )
}

function BookingsTab() {
  const { data: bookings, isLoading, isError } = useMyBookings()

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-40 items-center justify-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        Failed to load your bookings.
      </div>
    )
  }

  if (!bookings || bookings.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        You haven&apos;t booked any services yet.
      </p>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {bookings.map((booking) => (
        <CustomerBookingCard key={booking.id} booking={booking} />
      ))}
    </motion.div>
  )
}

function PaymentsTab() {
  const { data: payments, isLoading, isError } = useMyPayments()
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  )

  if (isLoading) {
    return (
      <>
        <TableSkeleton rows={5} cols={5} />
      </>
    )
  }

  if (isError) {
    return (
      <div className="flex h-40 items-center justify-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        Failed to load your payment history.
      </div>
    )
  }

  if (!payments || payments.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        No payments yet.
      </p>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow
                key={payment.id}
                className="cursor-pointer"
                onClick={() => setSelectedPaymentId(payment.id)}
              >
                <TableCell>{payment.booking.service.title}</TableCell>
                <TableCell>{payment.booking.technician.name}</TableCell>
                <TableCell className="font-medium text-primary">
                  ৳{payment.amount}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      payment.status === "COMPLETED" &&
                        "bg-emerald-500/10 text-emerald-600",
                      payment.status === "PENDING" &&
                        "bg-amber-500/10 text-amber-600",
                      payment.status === "FAILED" &&
                        "bg-red-500/10 text-red-600"
                    )}
                  >
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {payment.paidAt
                    ? new Date(payment.paidAt).toLocaleDateString()
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedPaymentId && (
        <PaymentDetailsDialog
          paymentId={selectedPaymentId}
          open={!!selectedPaymentId}
          onOpenChange={(open) => !open && setSelectedPaymentId(null)}
        />
      )}
    </>
  )
}
