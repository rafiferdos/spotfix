"use client"

import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAdminBookings } from "@/features/admin/hooks"
import { AlertCircle } from "lucide-react"
import { motion } from "motion/react"

export default function AdminBookingsPage() {
  const { data: bookings, isLoading, isError } = useAdminBookings()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-5xl p-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">Bookings</h1>
        <p className="mt-1 text-muted-foreground">
          Every booking across the platform.
        </p>
      </div>

      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Spinner />
        </div>
      )}
      {isError && (
        <div className="flex h-40 items-center justify-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" /> Failed to load bookings.
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
                <TableHead>Booking ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">
                    {b.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">
                      {b.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(b.scheduleDate).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(b.createdAt).toLocaleDateString()}
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
