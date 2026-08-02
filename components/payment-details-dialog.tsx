"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { usePayment } from "@/features/payments/hooks"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-emerald-500/10 text-emerald-600",
  PENDING: "bg-amber-500/10 text-amber-600",
  FAILED: "bg-red-500/10 text-red-600",
}

export function PaymentDetailsDialog({
  paymentId,
  open,
  onOpenChange,
}: {
  paymentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { data: payment, isLoading } = usePayment(open ? paymentId : "")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>
            Transaction #{paymentId.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        {isLoading || !payment ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="grid gap-3 text-sm">
            <Row label="Service">{payment.booking.service.title}</Row>
            <Row label="Technician">{payment.booking.technician.name}</Row>
            <Row label="Amount">৳{payment.amount}</Row>
            <Row label="Provider">{payment.provider}</Row>
            <Row label="Status">
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  STATUS_STYLES[payment.status]
                )}
              >
                {payment.status}
              </span>
            </Row>
            <Row label="Transaction ID">
              <span className="font-mono text-xs">{payment.transactionId}</span>
            </Row>
            <Row label="Paid at">
              {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "—"}
            </Row>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  )
}
