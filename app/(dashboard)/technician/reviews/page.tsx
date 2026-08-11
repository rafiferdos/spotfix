"use client"

import { Spinner } from "@/components/ui/spinner"
import { useTechnicianReviews } from "@/features/reviews/hooks"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import { motion } from "motion/react"

export default function TechnicianReviewsPage() {
  const { data, isLoading } = useTechnicianReviews()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-3xl p-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">Reviews</h1>
        <p className="mt-1 text-muted-foreground">
          Feedback from your customers.
        </p>
      </div>

      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Spinner />
        </div>
      )}

      {!isLoading && data && (
        <>
          <div className="mb-6 flex items-center gap-4 rounded-2xl border bg-card p-5">
            <div className="text-3xl font-semibold">
              {data.avgRating.toFixed(1)}
            </div>
            <div>
              <div className="flex items-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.round(data.avgRating)
                        ? "fill-primary"
                        : "fill-transparent"
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {data.total} review{data.total === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {data.reviews.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">
              No reviews yet.
            </p>
          ) : (
            <div className="grid gap-4">
              {data.reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {review.booking.service.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        By {review.booking.customer.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3.5 w-3.5",
                            i < review.rating
                              ? "fill-primary"
                              : "fill-transparent"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm text-foreground/90">
                      {review.comment}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
