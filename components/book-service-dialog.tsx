"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateBooking } from "@/features/bookings/hooks"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface BookServiceDialogProps {
  technicianId: string
  serviceId: string
  serviceTitle: string
  trigger: React.ReactNode
}

export function BookServiceDialog({
  technicianId,
  serviceId,
  serviceTitle,
  trigger,
}: BookServiceDialogProps) {
  const [open, setOpen] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const router = useRouter()
  const { mutate: bookService, isPending } = useCreateBooking()

  const handleSubmit = () => {
    if (!scheduleDate) return
    bookService(
      {
        technicianId,
        serviceId,
        scheduleDate: new Date(scheduleDate).toISOString(),
      },
      {
        onSuccess: () => {
          setOpen(false)
          setScheduleDate("")
          router.push("/customer")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book {serviceTitle}</DialogTitle>
          <DialogDescription>
            Pick a date and time. The technician will confirm your request.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <Label htmlFor="scheduleDate">Preferred date & time</Label>
          <Input
            id="scheduleDate"
            type="datetime-local"
            value={scheduleDate}
            min={new Date().toISOString().slice(0, 16)}
            onChange={(e) => setScheduleDate(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!scheduleDate || isPending}
            className="w-full"
          >
            {isPending ? "Requesting..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
