"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useTechnician } from "@/features/technicians/hooks"
import {
  AlertCircle,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  Star,
} from "lucide-react"
import Link from "next/link"
import { use } from "react"

export default function TechnicianProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: technician, isLoading, isError } = useTechnician(id)

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (isError || !technician) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p>Could not load this technician&apos;s profile.</p>
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
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
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
              {reviews.map((review) => (
                <Card key={review.id}>
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
    </div>
  )
}
