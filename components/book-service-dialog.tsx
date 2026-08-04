// components/book-service-dialog.tsx
"use client"

import { DateTimePicker } from "@/components/date-time-picker"
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
import { Label } from "@/components/ui/label"
import { useCreateBooking } from "@/features/bookings/hooks"
import { useRouter } from "next/navigation"
import { ReactElement, useState } from "react"

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
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>()
  const router = useRouter()
  const { mutate: bookService, isPending } = useCreateBooking()

  const handleSubmit = () => {
    if (!scheduleDate) return
    bookService(
      { technicianId, serviceId, scheduleDate: scheduleDate.toISOString() },
      {
        onSuccess: () => {
          setOpen(false)
          setScheduleDate(undefined)
          router.push("/customer")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={"w-fit"}
        render={trigger as ReactElement}
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book {serviceTitle}</DialogTitle>
          <DialogDescription>
            Pick a date and time. The technician will confirm your request.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <Label>Preferred date & time</Label>
          <DateTimePicker
            value={scheduleDate}
            onChange={setScheduleDate}
            minDate={new Date()}
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
