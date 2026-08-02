import { BookingStatusBadge } from "@/components/booking-status-badge"
import { LeaveReviewDialog } from "@/components/leave-review-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { BookingType } from "@/features/bookings/types"
import { Calendar } from "lucide-react"
import Link from "next/link"

export function CustomerBookingCard({ booking }: { booking: BookingType }) {
  const scheduleDate = new Date(booking.scheduleDate)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Booking</p>
          <p className="font-mono text-xs text-muted-foreground">
            #{booking.id.slice(0, 8)}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
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
      </CardFooter>
    </Card>
  )
}
