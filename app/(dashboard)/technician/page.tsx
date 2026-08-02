"use client"

import { BookingStatusBadge } from "@/components/booking-status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  useMyTechnicianProfile,
  useTechnicianBookings,
  useUpdateAvailability,
  useUpdateBookingStatus,
  useUpsertTechnicianProfile,
} from "@/features/technician-dashboard/hooks"
import { cn } from "@/lib/utils"
import { AlertCircle, Briefcase, CalendarClock, Plus, X } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

type Tab = "profile" | "availability" | "bookings"
const TABS: { id: Tab; label: string; icon: typeof Briefcase }[] = [
  { id: "profile", label: "Profile", icon: Briefcase },
  { id: "availability", label: "Availability", icon: CalendarClock },
  { id: "bookings", label: "Bookings", icon: CalendarClock },
]

export default function TechnicianDashboardPage() {
  const [tab, setTab] = useState<Tab>("profile")

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-4xl p-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">
          Technician Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your profile, availability, and incoming bookings.
        </p>
      </div>

      <div className="mb-6 flex w-fit gap-1 rounded-full bg-muted p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition",
              tab === id
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "profile" && <ProfileTab />}
      {tab === "availability" && <AvailabilityTab />}
      {tab === "bookings" && <BookingsTab />}
    </motion.div>
  )
}

function ProfileTab() {
  const { data: profile, isLoading } = useMyTechnicianProfile()
  const { mutate: save, isPending } = useUpsertTechnicianProfile()

  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [experience, setExperience] = useState("")
  const [pricing, setPricing] = useState("")

  useEffect(() => {
    if (profile) {
      setSkills(profile.skills)
      setExperience(String(profile.experience))
      setPricing(String(profile.pricing))
    }
  }, [profile])

  const addSkill = () => {
    const value = skillInput.trim()
    if (value && !skills.includes(value)) setSkills((prev) => [...prev, value])
    setSkillInput("")
  }

  if (isLoading) return <CenteredSpinner />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg space-y-5 rounded-2xl border bg-card p-6"
    >
      <div className="grid gap-2">
        <Label>Skills</Label>
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addSkill()
              }
            }}
            placeholder="e.g. Wiring, press Enter"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addSkill}
          >
            <Plus />
          </Button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1 rounded-full bg-secondary py-0.5 pr-1 pl-2.5 text-xs text-secondary-foreground"
              >
                {skill}
                <button
                  type="button"
                  onClick={() =>
                    setSkills((prev) => prev.filter((s) => s !== skill))
                  }
                  className="rounded-full p-0.5 hover:bg-foreground/10"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="experience">Experience (years)</Label>
        <Input
          id="experience"
          type="number"
          min="0"
          step="0.5"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="pricing">Hourly rate (৳)</Label>
        <Input
          id="pricing"
          type="number"
          min="0"
          step="1"
          value={pricing}
          onChange={(e) => setPricing(e.target.value)}
        />
      </div>

      <Button
        className="w-full"
        disabled={isPending}
        onClick={() =>
          save({
            skills,
            experience: Number(experience) || 0,
            pricing: Number(pricing) || 0,
          })
        }
      >
        {isPending ? "Saving..." : "Save Profile"}
      </Button>
    </motion.div>
  )
}

function AvailabilityTab() {
  const { data: profile, isLoading } = useMyTechnicianProfile()
  const { mutate: save, isPending } = useUpdateAvailability()

  const [slots, setSlots] = useState<string[]>([])
  const [slotInput, setSlotInput] = useState("")

  useEffect(() => {
    if (profile) setSlots(profile.availabilitySlots)
  }, [profile])

  const addSlot = () => {
    const value = slotInput.trim()
    if (value && !slots.includes(value)) setSlots((prev) => [...prev, value])
    setSlotInput("")
  }

  if (isLoading) return <CenteredSpinner />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg space-y-5 rounded-2xl border bg-card p-6"
    >
      <div className="grid gap-2">
        <Label>Available time slots</Label>
        <div className="flex gap-2">
          <Input
            value={slotInput}
            onChange={(e) => setSlotInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addSlot()
              }
            }}
            placeholder="e.g. Mon 9AM-1PM, press Enter"
          />
          <Button type="button" variant="outline" size="icon" onClick={addSlot}>
            <Plus />
          </Button>
        </div>
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
                  onClick={() =>
                    setSlots((prev) => prev.filter((s) => s !== slot))
                  }
                  className="rounded-full p-0.5 hover:bg-foreground/10"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <Button
        className="w-full"
        onClick={() => save({ slots })}
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save Availability"}
      </Button>
    </motion.div>
  )
}

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

function BookingsTab() {
  const { data: bookings, isLoading, isError } = useTechnicianBookings()
  const { mutate: updateStatus, isPending } = useUpdateBookingStatus()

  if (isLoading) return <CenteredSpinner />
  if (isError)
    return (
      <div className="flex h-40 items-center justify-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        Failed to load bookings.
      </div>
    )
  if (!bookings || bookings.length === 0)
    return (
      <p className="py-16 text-center text-muted-foreground">
        No bookings yet.
      </p>
    )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-2xl border bg-card"
    >
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
                        action.next === "DECLINED" ? "destructive" : "default"
                      }
                      disabled={isPending}
                      onClick={() =>
                        updateStatus({ id: booking.id, status: action.next })
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
    </motion.div>
  )
}

function CenteredSpinner() {
  return (
    <div className="flex h-40 items-center justify-center">
      <Spinner />
    </div>
  )
}
