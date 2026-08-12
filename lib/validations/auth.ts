import { z } from "zod"
import { USER_ROLES } from "../constants"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const credentialsSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .regex(emailRegex, { message: "Invalid email format" })
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(32, { message: "Password cannot exceed 32 characters" })
    .regex(/\d/, { message: "Password must contain at least one number" }),
})

export const loginSchema = credentialsSchema

export const registerSchema = credentialsSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.enum([USER_ROLES.CUSTOMER, USER_ROLES.TECHNICIAN, USER_ROLES.ADMIN], {
    message: "Please select a valid role",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Privacy Policy",
  }),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
