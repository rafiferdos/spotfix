"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTechnician } from "@/features/technicians/hooks"
import axios from "axios"
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Calendar,
  Loader2,
  Mail,
  Phone,
  Star,
  UserX,
} from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { use } from "react"

export default function TechnicianProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: technician, isLoading, isError, error } = useTechnician(id)

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !technician) {
    const isNotFound =
      axios.isAxiosError(error) && error.response?.status === 404

    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
        {isNotFound ? (
          <UserX className="h-10 w-10 text-muted-foreground" />
        ) : (
          <AlertCircle className="h-10 w-10 text-destructive" />
        )}
        <div>
          <p className="font-medium">
            {isNotFound
              ? "This technician doesn't exist."
              : "Something went wrong loading this profile."}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isNotFound
              ? "They may have been removed or the link is incorrect."
              : "Please try again in a moment."}
          </p>
        </div>
        <Link href="/technicians">
          <Button variant="outline" className="mt-2">
            <ArrowLeft className="h-4 w-4" />
            Back to technicians
          </Button>
        </Link>
      </div>
    )
  }

  const reviews = technician.user.technician.flatMap((booking) =>
    booking.review ? [booking.review] : []
  )
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null

  const initials = technician.user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto max-w-5xl px-4 py-12 sm:px-6"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-medium tracking-[-0.02em]">
                {technician.user.name}
              </h1>
              {avgRating && (
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {avgRating} ({reviews.length} review
                  {reviews.length === 1 ? "" : "s"})
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {technician.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium">Reviews</h2>
            {reviews.length === 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                No reviews yet.
              </p>
            )}
            <div className="mt-4 grid gap-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="pt-5">
                      <div className="flex items-center gap-1 text-primary">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-primary"
                                : "fill-transparent"
                            }`}
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="mt-2 text-sm text-foreground/90">
                          {review.comment}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  Experience
                </span>
                <span className="font-medium">{technician.experience} yrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rate</span>
                <span className="font-medium text-primary">
                  ৳{technician.pricing}/hr
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{technician.user.email}</span>
              </div>
              {technician.user.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{technician.user.phone}</span>
                </div>
              )}

              {technician.availabilitySlots.length > 0 && (
                <div>
                  <p className="mb-1.5 flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Available slots
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {technician.availabilitySlots.map((slot) => (
                      <span
                        key={slot}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-xs"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link href={`/login?redirectTo=/technicians/${technician.id}`}>
                <Button className="mt-2 w-full">Book Now</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
