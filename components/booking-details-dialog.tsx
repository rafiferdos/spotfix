"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookingStatusBadge } from "@/components/booking-status-badge"
import { Spinner } from "@/components/ui/spinner"
import { useBooking } from "@/features/bookings/hooks"

export function BookingDetailsDialog({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false)
  const { data: booking, isLoading } = useBooking(open ? bookingId : "")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="View booking details"
        >
          <Eye className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            Full details for booking #{bookingId.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        {isLoading || !booking ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="grid gap-3 text-sm">
            <Row label="Status">
              <BookingStatusBadge status={booking.status} />
            </Row>
            <Row label="Scheduled for">
              {new Date(booking.scheduleDate).toLocaleString()}
            </Row>
            <Row label="Requested on">
              {new Date(booking.createdAt).toLocaleString()}
            </Row>
            <Row label="Last updated">
              {new Date(booking.updatedAt).toLocaleString()}
            </Row>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  )
}