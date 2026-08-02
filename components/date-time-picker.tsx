"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"

interface DateTimePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  minDate?: Date
  placeholder?: string
}

export function DateTimePicker({
  value,
  onChange,
  minDate,
  placeholder = "Pick a date & time",
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const timeValue = value
    ? `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`
    : "10:00"

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return onChange(undefined)
    const [hours, minutes] = timeValue.split(":").map(Number)
    const next = new Date(date)
    next.setHours(hours, minutes, 0, 0)
    onChange(next)
  }

  const handleTimeChange = (time: string) => {
    if (!value) return
    const [hours, minutes] = time.split(":").map(Number)
    const next = new Date(value)
    next.setHours(hours, minutes, 0, 0)
    onChange(next)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value
          ? value.toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            handleSelectDate(date)
            setOpen(false)
          }}
          disabled={minDate ? { before: minDate } : undefined}
          autoFocus
        />
        <div className="border-t p-3">
          <Label htmlFor="time-picker" className="mb-1.5 block text-xs">
            Time
          </Label>
          <Input
            id="time-picker"
            type="time"
            value={timeValue}
            onChange={(e) => handleTimeChange(e.target.value)}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
