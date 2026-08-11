export interface TechnicianProfilePayload {
  skills: string[]
  experience: number
  pricing: number
  availabilitySlots?: string[]
}
export interface AvailabilityPayload {
  slots: string[]
}

export interface TechnicianEarningsSummary {
  totalEarnings: number
  completedJobs: number
  pendingPayoutJobs: number
  earningsByMonth: { month: string; earnings: number }[]
  topServices: { title: string; count: number; revenue: number }[]
}
