export type NotificationType =
  "INFO" | "SUCCESS" | "WARNING" | "BOOKING" | "PAYMENT"

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  link: string | null
  createdAt: string
}
