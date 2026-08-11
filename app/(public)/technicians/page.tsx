"use client"

import { FadeIn } from "@/components/fade-in"
import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { SkillsMultiSelect } from "@/components/skillsMultiSelect"
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
import { Spinner } from "@/components/ui/spinner"
import { useTechnicians } from "@/features/technicians/hooks"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { AlertCircle, Users } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"

const RATING_OPTIONS = ["5", "4", "3", "2", "1"]

interface TechniciansFilterForm {
  skills: string[]
  location: string
  rating: string
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
}

export default function TechniciansPage() {
  const { control, register, watch, reset } = useForm<TechniciansFilterForm>({
    defaultValues: { skills: [], location: "", rating: "" },
  })

  // Unfiltered baseline — used only to derive the list of available skills
  const { data: allTechnicians } = useTechnicians()

  const skillOptions = useMemo(() => {
    const skills = new Set<string>()
    allTechnicians?.forEach((t) => t.skills.forEach((s) => skills.add(s)))
    return Array.from(skills).sort((a, b) => a.localeCompare(b))
  }, [allTechnicians])

  const selectedSkills = watch("skills")
  const location = watch("location")
  const rating = watch("rating")

  const debouncedLocation = useDebouncedValue(location, 400)

  // Backend only supports a single `skill` string, so location/rating go to
  // the API and skill matching (AND logic across selected skills) happens client-side.
  const backendParams = useMemo(() => {
    const p: Record<string, string | number> = {}
    if (debouncedLocation.trim()) p.location = debouncedLocation.trim()
    if (rating) p.rating = Number(rating)
    return p
  }, [debouncedLocation, rating])

  const {
    data: technicians,
    isLoading,
    isError,
  } = useTechnicians(backendParams)

  const filteredTechnicians = useMemo(() => {
    if (!technicians) return technicians
    if (selectedSkills.length === 0) return technicians
    return technicians.filter((t) =>
      selectedSkills.every((skill) => t.skills.includes(skill))
    )
  }, [technicians, selectedSkills])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
          Find a Technician
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse verified professionals by skill, location, and rating.
        </p>
      </motion.div>

      <RevealGroup
        as="div"
        eager
        className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]"
      >
        <aside className="h-fit rounded-2xl border bg-card p-5">
          <Reveal className="flex items-center justify-between">
            <h2 className="font-medium">Filters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => reset({ skills: [], location: "", rating: "" })}
            >
              Reset
            </Button>
          </Reveal>

          <Reveal className="mt-5 grid gap-2">
            <Label>Skills</Label>
            <Controller
              control={control}
              name="skills"
              render={({ field }) => (
                <SkillsMultiSelect
                  options={skillOptions}
                  selected={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Reveal>

          <Reveal className="mt-5 grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Gulshan"
              {...register("location")}
            />
          </Reveal>

          <Reveal className="mt-5 grid gap-2">
            <Label htmlFor="rating">Minimum rating</Label>
            <Controller
              control={control}
              name="rating"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value ?? "")}
                >
                  <SelectTrigger id="rating" className="w-full">
                    <SelectValue placeholder="Any rating">
                      {field.value ? `${field.value}+ stars` : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {RATING_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}+ stars
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Reveal>
        </aside>

        <Reveal as="div">
          {isLoading && (
            <div className="flex h-60 items-center justify-center">
              <Spinner />
            </div>
          )}

          {isError && (
            <div className="flex h-60 items-center justify-center text-destructive">
              <AlertCircle className="mr-2 h-6 w-6" />
              <p>Failed to load technicians. Please try again.</p>
            </div>
          )}

          {!isLoading && !isError && filteredTechnicians?.length === 0 && (
            <div className="flex h-60 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <Users className="h-8 w-8" />
              <p>No technicians match your filters.</p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            filteredTechnicians &&
            filteredTechnicians.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {filteredTechnicians.map((tech, index) => (
                    <FadeIn key={index} delay={index * 0.2}>
                      <TechnicianCard technician={tech} />
                    </FadeIn>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
        </Reveal>
      </RevealGroup>
    </div>
  )
}
