"use client"

import { BookingDetailsDialog } from "@/components/booking-details-dialog"
import { BookingStatusBadge } from "@/components/booking-status-badge"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { LeaveReviewDialog } from "@/components/leave-review-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useCancelBooking } from "@/features/bookings/hooks"
import { BookingType } from "@/features/bookings/types"
import { Calendar } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const CANCELLABLE: BookingType["status"][] = ["REQUESTED", "ACCEPTED", "PAID"]

export function CustomerBookingCard({ booking }: { booking: BookingType }) {
  const scheduleDate = new Date(booking.scheduleDate)
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleConfirmCancel = () => {
    cancelBooking(booking.id, {
      onSuccess: () => setConfirmOpen(false),
    })
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Booking</p>
          <p className="font-mono text-xs text-muted-foreground">
            #{booking.id.slice(0, 8)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BookingStatusBadge status={booking.status} />
          <BookingDetailsDialog bookingId={booking.id} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 text-sm">
        <p className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {scheduleDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {booking.status === "ACCEPTED" && (
          <Link
            href={`/customer/bookings/${booking.id}/pay`}
            className="w-full"
          >
            <Button className="w-full">Pay Now</Button>
          </Link>
        )}
        {booking.status === "COMPLETED" && (
          <LeaveReviewDialog bookingId={booking.id} />
        )}
        {CANCELLABLE.includes(booking.status) && (
          <Button
            variant="outline"
            className="w-full text-destructive hover:bg-destructive/10"
            disabled={isCancelling}
            onClick={() => setConfirmOpen(true)}
          >
            {isCancelling ? "Cancelling..." : "Cancel Booking"}
          </Button>
        )}
      </CardFooter>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Cancel this booking?"
        description="This will cancel your booking request. This action cannot be undone."
        confirmLabel="Cancel Booking"
        cancelLabel="Keep Booking"
        loading={isCancelling}
        onConfirm={handleConfirmCancel}
      />
    </Card>
  )
}
