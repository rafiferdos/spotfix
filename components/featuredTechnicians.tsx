"use client"

import { TechnicianCard } from "@/components/technicianCard"
import { useTechnicians } from "@/features/technicians/hooks"
import { AlertCircle } from "lucide-react"
import { motion } from "motion/react"
import { Spinner } from "./ui/spinner"

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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto flex max-w-7xl flex-col px-6 py-20"
    >
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center text-4xl font-medium tracking-[-0.04em] text-pretty sm:text-[2.75rem]"
      >
        Top Rated Technicians
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mt-3 text-center text-xl tracking-[-0.01em] text-pretty text-muted-foreground sm:text-2xl"
      >
        Verified professionals our customers love
      </motion.p>

      {isLoading && (
        <div className="mt-20 flex h-40 items-center justify-center">
          <Spinner />
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
    </motion.div>
  )
}

export default FeaturedTechnicians
