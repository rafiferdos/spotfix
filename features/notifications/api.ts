import { axiosInstance } from "@/lib/axios"
import { NotificationItem } from "./types"

export const getMyNotifications = async (): Promise<NotificationItem[]> => {
  const res = await axiosInstance.get("/notifications")
  return res.data.data
}

export const getUnreadCount = async (): Promise<number> => {
  const res = await axiosInstance.get("/notifications/unread-count")
  return res.data.data.count
}

export const markNotificationRead = async (id: string): Promise<void> => {
  await axiosInstance.patch(`/notifications/${id}/read`)
}

export const markAllNotificationsRead = async (): Promise<void> => {
  await axiosInstance.patch("/notifications/read-all")
}
