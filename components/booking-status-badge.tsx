import { BookingStatus } from "@/features/bookings/types"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<BookingStatus, string> = {
  REQUESTED: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ACCEPTED: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  DECLINED: "bg-red-500/10 text-red-600 dark:text-red-400",
  PAID: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  IN_PROGRESS: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-red-900/10 text-red-800 dark:text-red-300",
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  REQUESTED: "Requested",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  PAID: "Paid",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
