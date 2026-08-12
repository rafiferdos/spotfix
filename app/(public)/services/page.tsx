"use client"

import { BookServiceDialog } from "@/components/book-service-dialog"
import { FadeIn } from "@/components/fade-in"
import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCategories } from "@/features/categories/hooks"
import { useServices } from "@/features/services/hooks"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { useAuth } from "@/store/use-auth"
import { AlertCircle, Search, Wrench } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"

const RATING_OPTIONS = ["5", "4", "3", "2", "1"]

interface ServicesFilterForm {
  search: string
  categoryId: string
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

export default function ServicesPage() {
  const { user } = useAuth()
  const { control, register, watch, reset } = useForm<ServicesFilterForm>({
    defaultValues: { search: "", categoryId: "", location: "", rating: "" },
  })

  const { data: categories } = useCategories()

  const search = watch("search")
  const categoryId = watch("categoryId")
  const location = watch("location")
  const rating = watch("rating")

  const debouncedSearch = useDebouncedValue(search, 400)
  const debouncedLocation = useDebouncedValue(location, 400)

  const params = useMemo(() => {
    const p: Record<string, string | number> = {}
    if (debouncedSearch.trim()) p.search = debouncedSearch.trim()
    if (categoryId) p.categoryId = categoryId
    if (debouncedLocation.trim()) p.location = debouncedLocation.trim()
    if (rating) p.rating = Number(rating)
    return p
  }, [debouncedSearch, categoryId, debouncedLocation, rating])

  const { data: services, isLoading, isError } = useServices(params)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
          Browse Services
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find the right professional for the job.
        </p>
      </motion.div>

      <RevealGroup
        as="div"
        eager
        className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]"
      >
        {/* Filters */}
        <aside className="h-fit rounded-2xl border bg-card p-5">
          <Reveal as="div" className="flex items-center justify-between">
            <h2 className="font-medium">Filters</h2>
            <Button variant="ghost" size="sm" onClick={() => reset()}>
              Reset
            </Button>
          </Reveal>

          <Reveal as="div" className="mt-5 grid gap-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                placeholder="e.g. AC repair"
                className="pl-8"
                {...register("search")}
              />
            </div>
          </Reveal>

          <Reveal as="div" className="mt-5 grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value ?? "")}
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="All categories">
                      {field.value
                        ? categories?.find((c) => c.id === field.value)?.name
                        : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Reveal>

          <Reveal as="div" className="mt-5 grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Dhanmondi"
              {...register("location")}
            />
          </Reveal>

          <Reveal as="div" className="mt-5 grid gap-2">
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

        {/* Results */}
        <Reveal as="div">
          {isLoading && (
            <>
              <CardGridSkeleton count={6} />
            </>
          )}

          {isError && (
            <div className="flex h-60 items-center justify-center text-destructive">
              <AlertCircle className="mr-2 h-6 w-6" />
              <p>Failed to load services. Please try again.</p>
            </div>
          )}

          {!isLoading && !isError && services?.length === 0 && (
            <div className="flex h-60 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <Wrench className="h-8 w-8" />
              <p>No services match your filters.</p>
            </div>
          )}

          {!isLoading && !isError && services && services.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {services.map((service, index) => (
                  <FadeIn key={index} delay={0.2 * index}>
                    <Card className="flex h-full flex-col">
                      <CardHeader>
                        <CardTitle>{service.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-muted-foreground">
                            {service.category.name}
                          </span>
                          <span className="font-medium text-primary">
                            ৳{service.price}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          By {service.technician.name}
                          {service.technician.address
                            ? ` · ${service.technician.address}`
                            : ""}
                        </p>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Link
                          href={`/technicians/${service.technicianId}`}
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full">
                            View Technician
                          </Button>
                        </Link>
                        {!user ? (
                          <Link
                            href="/login?redirectTo=/services"
                            className="flex-1"
                          >
                            <Button className="w-full">Login to Book</Button>
                          </Link>
                        ) : user.role === "CUSTOMER" ? (
                          <BookServiceDialog
                            technicianId={service.technicianId}
                            serviceId={service.id}
                            serviceTitle={service.title}
                            trigger={
                              <Button className="w-full">Book Now</Button>
                            }
                          />
                        ) : null}
                      </CardFooter>
                    </Card>
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
