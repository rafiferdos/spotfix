"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  useMyTechnicianProfile,
  useUpsertTechnicianProfile,
} from "@/features/technician-dashboard/hooks"
import { Plus, X } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"

export default function TechnicianProfilePage() {
  const { data: profile, isLoading } = useMyTechnicianProfile()
  const { mutate: save, isPending } = useUpsertTechnicianProfile()

  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [experience, setExperience] = useState("")
  const [pricing, setPricing] = useState("")
  const [loadedId, setLoadedId] = useState<string | null>(null)

  if (profile && profile.id !== loadedId) {
    setLoadedId(profile.id)
    setSkills(profile.skills)
    setExperience(String(profile.experience))
    setPricing(String(profile.pricing))
  }

  const addSkill = () => {
    const value = skillInput.trim()
    if (value && !skills.includes(value)) setSkills((prev) => [...prev, value])
    setSkillInput("")
  }

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
        <h1 className="text-2xl font-medium tracking-[-0.02em]">Profile</h1>
        <p className="mt-1 text-muted-foreground">
          This is what customers see on your public profile.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border bg-card p-6">
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
      </div>
    </motion.div>
  )
}
