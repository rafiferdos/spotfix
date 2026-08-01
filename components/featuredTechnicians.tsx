"use client"

import { TechnicianCard } from "@/components/technicianCard"
import { useTechnicians } from "@/features/technicians/hooks"
import { AlertCircle, Loader2 } from "lucide-react"

const FeaturedTechnicians = () => {
  const {
    data: technicians,
    isLoading,
    isError,
  } = useTechnicians({
    rating: 4,
  })

  const topTechnicians = technicians?.slice(0, 6)

  return (
    <div className="mx-auto flex max-w-7xl flex-col px-6 py-20">
      <h2 className="text-center text-4xl font-medium tracking-[-0.04em] text-pretty sm:text-[2.75rem]">
        Top Rated Technicians
      </h2>
      <p className="mt-3 text-center text-xl tracking-[-0.01em] text-pretty text-muted-foreground sm:text-2xl">
        Verified professionals our customers love
      </p>

      {isLoading && (
        <div className="mt-20 flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {isError && (
        <div className="mt-20 flex h-40 items-center justify-center text-destructive">
          <AlertCircle className="mr-2 h-6 w-6" />
          <p>Failed to load technicians.</p>
        </div>
      )}

      {!isLoading && !isError && topTechnicians?.length === 0 && (
        <p className="mt-20 text-center text-muted-foreground">
          No top-rated technicians yet.
        </p>
      )}

      {!isLoading &&
        !isError &&
        topTechnicians &&
        topTechnicians.length > 0 && (
          <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topTechnicians.map((tech) => (
              <TechnicianCard key={tech.id} technician={tech} />
            ))}
          </div>
        )}
    </div>
  )
}

export default FeaturedTechnicians
