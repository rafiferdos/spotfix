import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <XCircle className="h-14 w-14 text-destructive" />
      <h1 className="mt-4 text-xl font-medium">Payment cancelled</h1>
      <p className="mt-1 text-muted-foreground">
        No worries — you can try again anytime from your dashboard.
      </p>
      <Link href="/customer" className="mt-6 w-full">
        <Button className="w-full">Back to Dashboard</Button>
      </Link>
    </div>
  )
}
