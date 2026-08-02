"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useBooking } from "@/features/bookings/hooks"
import { useCreateCheckoutSession } from "@/features/payments/hooks"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { use, useState } from "react"

export default function PayBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { data: booking, isLoading, isError } = useBooking(id)
  const { mutate: startCheckout, isPending } = useCreateCheckoutSession()
  const [redirecting, setRedirecting] = useState(false)

  const handlePay = () => {
    startCheckout(id, {
      onSuccess: (session) => {
        setRedirecting(true)
        window.location.href = session.paymentUrl
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (isError || !booking) {
    return (
      <div className="flex h-60 flex-col items-center justify-center gap-2 text-destructive">
        <AlertCircle className="h-6 w-6" />
        <p>Couldn&apos;t find this booking.</p>
        <Button variant="outline" onClick={() => router.push("/customer")}>
          Back to dashboard
        </Button>
      </div>
    )
  }

  if (booking.status !== "ACCEPTED") {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="text-lg font-medium">This booking isn&apos;t payable.</p>
        <p className="mt-1 text-muted-foreground">
          Only accepted bookings can be paid for. Current status:{" "}
          {booking.status}.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => router.push("/customer")}
        >
          Back to dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <h1 className="text-xl font-medium">Complete your payment</h1>
      <p className="mt-1 text-muted-foreground">
        You&apos;ll be redirected to Stripe to complete this payment securely.
      </p>
      <Button
        className="mt-6 w-full"
        onClick={handlePay}
        disabled={isPending || redirecting}
      >
        {isPending || redirecting ? "Redirecting..." : "Pay Now"}
      </Button>
    </div>
  )
}
