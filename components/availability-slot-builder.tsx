"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Moon, Plus, Sun, Sunrise, Sunset, X } from "lucide-react"
import { useState } from "react"

const PERIODS = [
  {
    value: "Morning",
    icon: Sunrise,
    defaultStart: "08:00",
    defaultEnd: "12:00",
  },
  { value: "Afternoon", icon: Sun, defaultStart: "12:00", defaultEnd: "16:00" },
  {
    value: "Evening",
    icon: Sunset,
    defaultStart: "16:00",
    defaultEnd: "20:00",
  },
  { value: "Night", icon: Moon, defaultStart: "20:00", defaultEnd: "23:00" },
  { value: "Custom", icon: null, defaultStart: "09:00", defaultEnd: "17:00" },
] as const

function to12Hour(time: string) {
  const [hStr, mStr] = time.split(":")
  let h = Number(hStr)
  const suffix = h >= 12 ? "PM" : "AM"
  h = h % 12 || 12
  return `${String(h).padStart(2, "0")}:${mStr} ${suffix}`
}

interface AvailabilitySlotBuilderProps {
  slots: string[]
  onChange: (slots: string[]) => void
}

export function AvailabilitySlotBuilder({
  slots,
  onChange,
}: AvailabilitySlotBuilderProps) {
  const [period, setPeriod] =
    useState<(typeof PERIODS)[number]["value"]>("Morning")
  const [customLabel, setCustomLabel] = useState("")
  const [start, setStart] = useState(PERIODS[0].defaultStart)
  const [end, setEnd] = useState(PERIODS[0].defaultEnd)

  const handlePeriodChange = (value: (typeof PERIODS)[number]["value"]) => {
    const next = PERIODS.find((p) => p.value === value)!
    setPeriod(next.value)
    setStart(next.defaultStart)
    setEnd(next.defaultEnd)
  }

  const addSlot = () => {
    const label = period === "Custom" ? customLabel.trim() || "Custom" : period
    const value = `${label} (${to12Hour(start)} - ${to12Hour(end)})`
    if (!slots.includes(value)) onChange([...slots, value])
    if (period === "Custom") setCustomLabel("")
  }

  const removeSlot = (value: string) =>
    onChange(slots.filter((s) => s !== value))

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => handlePeriodChange(p.value)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-3 text-xs font-medium transition",
              period === p.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {p.icon ? (
              <p.icon className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {p.value}
          </button>
        ))}
      </div>

      {period === "Custom" && (
        <div className="grid gap-2">
          <Label htmlFor="custom-label">Label</Label>
          <Input
            id="custom-label"
            placeholder="e.g. Weekend, On-call"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label htmlFor="start-time">From</Label>
          <Input
            id="start-time"
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="end-time">To</Label>
          <Input
            id="end-time"
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addSlot}
        className="w-full"
      >
        <Plus className="h-4 w-4" />
        Add Slot
      </Button>

      {slots.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {slots.map((slot) => (
            <span
              key={slot}
              className="flex items-center gap-1 rounded-full bg-secondary py-0.5 pr-1 pl-2.5 text-xs text-secondary-foreground"
            >
              {slot}
              <button
                type="button"
                onClick={() => removeSlot(slot)}
                className="rounded-full p-0.5 hover:bg-foreground/10"
                aria-label={`Remove ${slot}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
