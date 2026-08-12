"use client"

import { BookingStatusBadge } from "@/components/booking-status-badge"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BookingStatus } from "@/features/bookings/types"
import {
  useTechnicianBookings,
  useUpdateBookingStatus,
} from "@/features/technician-dashboard/hooks"
import { AlertCircle } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"

const NEXT_STATUS: Partial<
  Record<
    BookingStatus,
    { label: string; next: BookingStatus; confirm?: boolean }[]
  >
> = {
  REQUESTED: [
    { label: "Accept", next: "ACCEPTED" },
    { label: "Decline", next: "DECLINED", confirm: true },
  ],
  PAID: [{ label: "Start Job", next: "IN_PROGRESS" }],
  IN_PROGRESS: [{ label: "Mark Completed", next: "COMPLETED", confirm: true }],
}

export default function TechnicianJobsPage() {
  const { data: bookings, isLoading, isError } = useTechnicianBookings()
  const { mutate: updateStatus, isPending } = useUpdateBookingStatus()
  const [pendingAction, setPendingAction] = useState<{
    id: string
    status: BookingStatus
    label: string
  } | null>(null)

  const runAction = (
    id: string,
    status: BookingStatus,
    confirm?: boolean,
    label?: string
  ) => {
    if (confirm) {
      setPendingAction({ id, status, label: label ?? "" })
      return
    }
    updateStatus({ id, status })
  }

  const confirmCopy =
    pendingAction?.status === "COMPLETED"
      ? {
          title: "Mark this job as completed?",
          description:
            "This will notify the customer and finalize the booking. This action cannot be undone.",
        }
      : {
          title: "Decline this booking request?",
          description:
            "The customer will be notified that you declined this request.",
        }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-5xl p-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">Jobs</h1>
        <p className="mt-1 text-muted-foreground">
          Incoming requests and jobs in progress.
        </p>
      </div>

      {isLoading && <TableRowsSkeleton />}

      {isError && (
        <div className="flex h-40 items-center justify-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Failed to load bookings.
        </div>
      )}

      {!isLoading && !isError && (!bookings || bookings.length === 0) && (
        <p className="py-16 text-center text-muted-foreground">
          No bookings yet.
        </p>
      )}

      {!isLoading && !isError && bookings && bookings.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono text-xs">
                    #{booking.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(booking.scheduleDate).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {NEXT_STATUS[booking.status]?.map((action) => (
                        <Button
                          key={action.next}
                          size="sm"
                          variant={
                            action.next === "DECLINED"
                              ? "destructive"
                              : "default"
                          }
                          disabled={isPending}
                          onClick={() =>
                            runAction(
                              booking.id,
                              action.next,
                              action.confirm,
                              action.label
                            )
                          }
                        >
                          {action.label}
                        </Button>
                      ))}
                      {!NEXT_STATUS[booking.status] && (
                        <span className="text-xs text-muted-foreground">
                          No actions
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingAction}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title={confirmCopy.title}
        description={confirmCopy.description}
        confirmLabel="Yes, confirm"
        cancelLabel="No, go back"
        destructive={pendingAction?.status === "DECLINED"}
        loading={isPending}
        onConfirm={() => {
          if (!pendingAction) return
          updateStatus(
            { id: pendingAction.id, status: pendingAction.status },
            { onSuccess: () => setPendingAction(null) }
          )
        }}
      />
    </motion.div>
  )
}

function TableRowsSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="divide-y">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="ml-auto h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
