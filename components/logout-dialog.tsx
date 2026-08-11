"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { logoutAction } from "@/service/auth-actions"
import { useAuth } from "@/store/use-auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { sileo } from "sileo"

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const router = useRouter()
  const { logout } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    await logoutAction()
    logout()
    sileo.success({ title: "Logged out", description: "See you again soon!" })
    onOpenChange(false)
    router.push("/")
    router.refresh()
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log out of Spotfix?</DialogTitle>
          <DialogDescription>
            You&apos;ll need to sign in again to access your dashboard.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Logging out..." : "Log Out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
