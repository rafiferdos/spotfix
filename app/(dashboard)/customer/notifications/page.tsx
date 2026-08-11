"use client"

import { Spinner } from "@/components/ui/spinner"
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useMyNotifications,
} from "@/features/notifications/hooks"
import { cn } from "@/lib/utils"
import { Bell, CheckCheck } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"

const TYPE_STYLES: Record<string, string> = {
  INFO: "bg-blue-500/10 text-blue-600",
  SUCCESS: "bg-emerald-500/10 text-emerald-600",
  WARNING: "bg-amber-500/10 text-amber-600",
  BOOKING: "bg-primary/10 text-primary",
  PAYMENT: "bg-purple-500/10 text-purple-600",
}

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useMyNotifications()
  const { mutate: markRead } = useMarkNotificationRead()
  const { mutate: markAllRead, isPending } = useMarkAllNotificationsRead()

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-3xl p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-[-0.02em]">
            Notifications
          </h1>
          <p className="mt-1 text-muted-foreground">
            Updates about your bookings and payments.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead()}
            disabled={isPending}
            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Spinner />
        </div>
      )}

      {!isLoading && (!notifications || notifications.length === 0) && (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
          <Bell className="h-8 w-8" />
          <p>No notifications yet.</p>
        </div>
      )}

      {!isLoading && notifications && notifications.length > 0 && (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => {
            const content = (
              <div
                className={cn(
                  "flex items-start gap-3 rounded-2xl border bg-card p-4 transition",
                  !n.isRead && "border-primary/30 bg-primary/[0.03]"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    TYPE_STYLES[n.type]
                  )}
                >
                  {n.type}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{n.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {n.message}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.isRead && (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
              </div>
            )
            return n.link ? (
              <Link
                key={n.id}
                href={n.link}
                onClick={() => !n.isRead && markRead(n.id)}
              >
                {content}
              </Link>
            ) : (
              <div key={n.id} onClick={() => !n.isRead && markRead(n.id)}>
                {content}
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
