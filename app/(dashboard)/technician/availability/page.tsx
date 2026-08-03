"use client"

import { AvailabilitySlotBuilder } from "@/components/availability-slot-builder"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  useMyTechnicianProfile,
  useUpdateAvailability,
} from "@/features/technician-dashboard/hooks"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

export default function AvailabilityPage() {
  const { data: profile, isLoading } = useMyTechnicianProfile()
  const { mutate: save, isPending } = useUpdateAvailability()
  const [slots, setSlots] = useState<string[]>([])

  useEffect(() => {
    if (profile) setSlots(profile.availabilitySlots)
  }, [profile])

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-2xl p-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">Schedule</h1>
        <p className="mt-1 text-muted-foreground">
          Let customers know when you&apos;re free to take jobs.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <AvailabilitySlotBuilder slots={slots} onChange={setSlots} />

        <Button
          className="mt-6 w-full"
          onClick={() => save({ slots })}
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Schedule"}
        </Button>
      </div>
    </motion.div>
  )
}
