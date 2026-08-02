export interface TechnicianProfilePayload {
  skills: string[]
  experience: number
  pricing: number
  availabilitySlots?: string[]
}
export interface AvailabilityPayload {
  slots: string[]
}
