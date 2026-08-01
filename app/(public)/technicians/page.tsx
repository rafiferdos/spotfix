"use client"

import { TechnicianCard } from "@/components/technicianCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTechnicians } from "@/features/technicians/hooks"
import { AlertCircle, Loader2, Users } from "lucide-react"
import { useMemo, useState } from "react"

const RATING_OPTIONS = ["5", "4", "3", "2", "1"]

export default function TechniciansPage() {
  const [skill, setSkill] = useState("")
  const [location, setLocation] = useState("")
  const [rating, setRating] = useState("")

  const params = useMemo(() => {
    const p: Record<string, string | number> = {}
    if (skill.trim()) p.skill = skill.trim()
    if (location.trim()) p.location = location.trim()
    if (rating) p.rating = Number(rating)
    return p
  }, [skill, location, rating])

  const { data: technicians, isLoading, isError } = useTechnicians(params)

  const resetFilters = () => {
    setSkill("")
    setLocation("")
    setRating("")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
          Find a Technician
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse verified professionals by skill, location, and rating.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Filters</h2>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset
            </Button>
          </div>

          <div className="mt-5 grid gap-2">
            <Label htmlFor="skill">Skill</Label>
            <Input
              id="skill"
              placeholder="e.g. Plumbing"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
          </div>

          <div className="mt-5 grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Gulshan"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="mt-5 grid gap-2">
            <Label htmlFor="rating">Minimum rating</Label>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger id="rating" className="w-full">
                <SelectValue placeholder="Any rating" />
              </SelectTrigger>
              <SelectContent>
                {RATING_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}+ stars
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </aside>

        <div>
          {isLoading && (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {isError && (
            <div className="flex h-60 items-center justify-center text-destructive">
              <AlertCircle className="mr-2 h-6 w-6" />
              <p>Failed to load technicians.</p>
            </div>
          )}

          {!isLoading && !isError && technicians?.length === 0 && (
            <div className="flex h-60 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <Users className="h-8 w-8" />
              <p>No technicians match your filters.</p>
            </div>
          )}

          {!isLoading && !isError && technicians && technicians.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {technicians.map((tech) => (
                <TechnicianCard key={tech.id} technician={tech} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
