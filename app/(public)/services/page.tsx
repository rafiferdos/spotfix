"use client"

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
import { Spinner } from "@/components/ui/spinner"
import { useCategories } from "@/features/categories/hooks"
import { useServices } from "@/features/services/hooks"
import { AlertCircle, Loader2, Search, Wrench } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

const RATING_OPTIONS = ["5", "4", "3", "2", "1"]

export default function ServicesPage() {
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [location, setLocation] = useState("")
  const [rating, setRating] = useState("")

  const { data: categories } = useCategories()

  const params = useMemo(() => {
    const p: Record<string, string | number> = {}
    if (search.trim()) p.search = search.trim()
    if (categoryId) p.categoryId = categoryId
    if (location.trim()) p.location = location.trim()
    if (rating) p.rating = Number(rating)
    return p
  }, [search, categoryId, location, rating])

  const { data: services, isLoading, isError } = useServices(params)

  const resetFilters = () => {
    setSearch("")
    setCategoryId("")
    setLocation("")
    setRating("")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
          Browse Services
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find the right professional for the job.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="h-fit rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Filters</h2>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset
            </Button>
          </div>

          <div className="mt-5 grid gap-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                placeholder="e.g. AC repair"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-5 grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Dhanmondi"
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

        {/* Results */}
        <div>
          {isLoading && (
            <div className="flex h-60 items-center justify-center">
              <Spinner />
            </div>
          )}

          {isError && (
            <div className="flex h-60 items-center justify-center text-destructive">
              <AlertCircle className="mr-2 h-6 w-6" />
              <p>Failed to load services.</p>
            </div>
          )}

          {!isLoading && !isError && services?.length === 0 && (
            <div className="flex h-60 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <Wrench className="h-8 w-8" />
              <p>No services match your filters.</p>
            </div>
          )}

          {!isLoading && !isError && services && services.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <Card key={service.id} className="flex flex-col">
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
                  <CardFooter>
                    <Link
                      href={`/technicians/${service.technicianId}`}
                      className="w-full"
                    >
                      <Button className="w-full">View Technician</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
