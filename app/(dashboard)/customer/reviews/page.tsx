"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useMyReviews, useUpdateReview } from "@/features/reviews/hooks"
import { MyReviewType } from "@/features/reviews/types"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"

export default function MyReviewsPage() {
  const { data: reviews, isLoading } = useMyReviews()
  const [editing, setEditing] = useState<MyReviewType | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-3xl p-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">My Reviews</h1>
        <p className="mt-1 text-muted-foreground">
          Reviews you&apos;ve left for technicians.
        </p>
      </div>

      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Spinner />
        </div>
      )}

      {!isLoading && (!reviews || reviews.length === 0) && (
        <p className="py-16 text-center text-muted-foreground">
          You haven&apos;t left any reviews yet. Complete a booking to leave
          one.
        </p>
      )}

      {!isLoading && reviews && reviews.length > 0 && (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{review.booking.service.title}</p>
                  <p className="text-sm text-muted-foreground">
                    By {review.booking.technician.name}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(review)}
                >
                  Edit
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < review.rating ? "fill-primary" : "fill-transparent"
                    )}
                  />
                ))}
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

      <EditReviewDialog
        key={editing?.id ?? "none"}
        review={editing}
        onClose={() => setEditing(null)}
      />
    </motion.div>
  )
}

function EditReviewDialog({
  review,
  onClose,
}: {
  review: MyReviewType | null
  onClose: () => void
}) {
  const { mutate: update, isPending } = useUpdateReview()
  const [rating, setRating] = useState(review?.rating ?? 0)
  const [comment, setComment] = useState(review?.comment ?? "")

  return (
    <Dialog open={!!review} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="p-1"
              >
                <Star
                  className={cn(
                    "h-7 w-7 transition-colors",
                    value <= rating
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Update your comment..."
          />
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            disabled={isPending || !review}
            onClick={() => {
              if (!review) return
              update(
                {
                  id: review.id,
                  payload: { rating, comment: comment || undefined },
                },
                { onSuccess: () => onClose() }
              )
            }}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
