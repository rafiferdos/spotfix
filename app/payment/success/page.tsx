import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <CheckCircle2 className="h-14 w-14 text-emerald-500" />
      <h1 className="mt-4 text-xl font-medium">Payment successful!</h1>
      <p className="mt-1 text-muted-foreground">
        Your booking is now marked as paid. The technician will be notified.
      </p>
      <Link href="/customer" className="mt-6 w-full">
        <Button className="w-full">Go to Dashboard</Button>
      </Link>
    </div>
  )
}
