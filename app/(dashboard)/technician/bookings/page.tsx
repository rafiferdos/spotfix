"use client"

import { BookingStatusBadge } from "@/components/booking-status-badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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

const NEXT_STATUS: Partial<
  Record<BookingStatus, { label: string; next: BookingStatus }[]>
> = {
  REQUESTED: [
    { label: "Accept", next: "ACCEPTED" },
    { label: "Decline", next: "DECLINED" },
  ],
  PAID: [{ label: "Start Job", next: "IN_PROGRESS" }],
  IN_PROGRESS: [{ label: "Mark Completed", next: "COMPLETED" }],
}

export default function TechnicianJobsPage() {
  const { data: bookings, isLoading, isError } = useTechnicianBookings()
  const { mutate: updateStatus, isPending } = useUpdateBookingStatus()

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

      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Spinner />
        </div>
      )}

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
                            updateStatus({
                              id: booking.id,
                              status: action.next,
                            })
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
    </motion.div>
  )
}
