export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
  ADMIN: "ADMIN",
} as const

export type UserRole = keyof typeof USER_ROLES
