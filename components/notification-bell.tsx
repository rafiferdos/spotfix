"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useMyNotifications,
  useUnreadCount,
} from "@/features/notifications/hooks"
import { cn } from "@/lib/utils"
import { Bell, CheckCheck } from "lucide-react"
import Link from "next/link"

const TYPE_DOT: Record<string, string> = {
  INFO: "bg-blue-500",
  SUCCESS: "bg-emerald-500",
  WARNING: "bg-amber-500",
  BOOKING: "bg-primary",
  PAYMENT: "bg-purple-500",
}

export function NotificationBell() {
  const { data: notifications } = useMyNotifications()
  const { data: unreadCount } = useUnreadCount()
  const { mutate: markRead } = useMarkNotificationRead()
  const { mutate: markAllRead } = useMarkAllNotificationsRead()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition outline-none hover:bg-muted hover:text-foreground">
        <Bell className="h-4 w-4" />
        {!!unreadCount && unreadCount > 0 && (
          <span className="text-destructive-foreground absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <div className="flex items-center justify-between px-2 py-1">
            <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
            {!!unreadCount && unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <CheckCheck className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-96 overflow-y-auto">
            {!notifications || notifications.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                No notifications yet.
              </p>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className={cn(
                    "flex cursor-pointer flex-col items-start gap-0.5 whitespace-normal",
                    !n.isRead && "bg-primary/5"
                  )}
                  onClick={() => !n.isRead && markRead(n.id)}
                  render={n.link ? <Link href={n.link} /> : undefined}
                >
                  <div className="flex w-full items-center gap-2">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        TYPE_DOT[n.type]
                      )}
                    />
                    <span className="text-sm font-medium">{n.title}</span>
                  </div>
                  <p className="pl-3.5 text-xs text-muted-foreground">
                    {n.message}
                  </p>
                  <p className="pl-3.5 text-[11px] text-muted-foreground/70">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
