"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateReview } from "@/features/reviews/hooks"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import { useState } from "react"

export function LeaveReviewDialog({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const { mutate: submitReview, isPending } = useCreateReview()

  const handleSubmit = () => {
    if (rating === 0) return
    submitReview(
      { bookingId, rating, comment: comment.trim() || undefined },
      {
        onSuccess: () => {
          setOpen(false)
          setRating(0)
          setComment("")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="w-full">
            Leave a Review
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate your experience</DialogTitle>
          <DialogDescription>
            Let others know how the job went.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="p-1"
                aria-label={`${value} star`}
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

          <div className="grid gap-2">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Textarea
              id="comment"
              placeholder="Tell us more..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isPending}
            className="w-full"
          >
            {isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
