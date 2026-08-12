"use client"

import { useServices } from "@/features/services/hooks"
import { ServiceType } from "@/features/services/types"
import { AlertCircle, Wrench } from "lucide-react"
import { motion } from "motion/react"
import { CardGridSkeleton } from "./skeletons/card-grid-skeleton"

const Features = () => {
  // Fetching top-rated services with query parameters
  const {
    data: services,
    isLoading,
    isError,
  } = useServices({
    rating: 5,
    limit: 6,
  })

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
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-center text-4xl font-medium tracking-[-0.04em] text-pretty sm:text-[2.75rem]"
      >
        Featured Services
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mt-3 text-center text-xl tracking-[-0.01em] text-pretty text-muted-foreground sm:text-2xl"
      >
        Top-rated professionals ready to help you
      </motion.p>

      {/* Loading State */}
      {isLoading && (
        <div className="py-8 md:py-18">
          <CardGridSkeleton count={6} />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="mt-20 flex h-40 items-center justify-center text-destructive">
          <AlertCircle className="mr-2 h-6 w-6" />
          <p>Failed to load featured services.</p>
        </div>
      )}

      {/* Data Grid */}
      {!isLoading && !isError && (
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(services?.data ?? []).map((service: ServiceType) => (
            <div
              className="relative flex flex-col overflow-hidden rounded-xl border bg-card p-6 dark:border-card-foreground/7"
              key={service.id}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary dark:bg-primary/10">
                <Wrench className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <h3 className="mt-5 line-clamp-1 text-lg font-medium tracking-[-0.005em]">
                  {service.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-foreground/80">
                  {service.description}
                </p>
              </div>

              {/* Added Price & Category for Marketplace context */}
              <div className="z-10 mt-6 flex items-center justify-between border-t pt-4 text-sm font-medium dark:border-card-foreground/10">
                <span className="text-base text-primary">৳{service.price}</span>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-muted-foreground">
                  {service.category?.name ?? "General"}
                </span>
              </div>

              {/* Background Masking - Preserved Exactly */}
              <div
                className="pointer-events-none absolute inset-0 -top-px z-0"
                style={{
                  backgroundImage: `
          linear-gradient(to right, var(--border) 1px, transparent 1px),
          linear-gradient(to bottom, var(--border) 1px, transparent 1px)
        `,
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 0",
                  maskImage: `
            repeating-linear-gradient(
                to right,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              repeating-linear-gradient(
                to bottom,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              radial-gradient(ellipse 100% 80% at 100% 0%, #000 50%, transparent 100%)
        `,
                  WebkitMaskImage: `
      repeating-linear-gradient(
                to right,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              repeating-linear-gradient(
                to bottom,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)
        `,
                  maskComposite: "intersect",
                  WebkitMaskComposite: "source-in",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default Features
