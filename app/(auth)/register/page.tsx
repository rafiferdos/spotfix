"use client"

import { GoogleSignInButton } from "@/components/google-sign-in-button"
import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { AuthForm, FormFieldConfig } from "@/components/shared/AuthForm"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { axiosInstance } from "@/lib/axios"
import { USER_ROLES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { RegisterFormValues, registerSchema } from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowBigLeftDash, Check, HardHat, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { sileo } from "sileo"

const ROLE_OPTIONS = [
  {
    value: USER_ROLES.CUSTOMER,
    title: "Customer",
    description: "Book trusted technicians for home services.",
    icon: ShoppingBag,
  },
  {
    value: USER_ROLES.TECHNICIAN,
    title: "Technician",
    description: "Offer your services and manage bookings.",
    icon: HardHat,
  },
] as const

export default function RegisterPage() {
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      role: USER_ROLES.CUSTOMER,
      agreeToTerms: false,
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    const registerRequest = axiosInstance.post("/auth/register", values)
    try {
      await sileo.promise(registerRequest, {
        loading: { title: "Creating your account..." },
        success: { title: "Account created successfully!" },
        error: { title: "Registration failed. Please try again." },
      })
      router.push("/login")
    } catch {
      sileo.error({
        title: "Registration failed",
        description: "Please try again.",
      })
    }
  }

  const registerFields: FormFieldConfig<RegisterFormValues>[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Your full name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "m@example.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "********",
    },
    { name: "phone", label: "Phone", type: "text", placeholder: "+1234567890" },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "123 Main St, City, Country",
    },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <RevealGroup eager as="div" className="w-full max-w-md">
        <Card>
          <CardHeader className="flex">
            <RevealGroup as="div">
              <Reveal as="div">
                <CardTitle>Join Spotfix</CardTitle>
              </Reveal>
              <Reveal as="div">
                <CardDescription>
                  Create an account to get started with Spotfix. Fill in your
                  details below to register.
                </CardDescription>
              </Reveal>
            </RevealGroup>
            <Reveal as="span">
              <CardAction>
                <Link href="/login">
                  <Button variant="link">Log In</Button>
                </Link>
              </CardAction>
            </Reveal>
          </CardHeader>
          <RevealGroup eager as="div">
            <Reveal>
              <CardContent>
                <AuthForm
                  form={form}
                  onSubmit={onSubmit}
                  fields={registerFields}
                >
                  <Reveal as="div" className="grid gap-2">
                    <span className="text-sm font-medium">Register as</span>
                    <Controller
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <Reveal as="div" className="grid grid-cols-2 gap-3">
                          {ROLE_OPTIONS.map((option) => {
                            const isSelected = field.value === option.value
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => field.onChange(option.value)}
                                aria-pressed={isSelected}
                                className={cn(
                                  "group relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition",
                                  isSelected
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                                    : "border-border hover:border-primary/40 hover:bg-muted"
                                )}
                              >
                                <div
                                  className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-full transition",
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground group-hover:text-foreground"
                                  )}
                                >
                                  <option.icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    {option.title}
                                  </p>
                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    {option.description}
                                  </p>
                                </div>
                                {isSelected && (
                                  <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    <Check className="h-3 w-3" />
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </Reveal>
                      )}
                    />
                    {form.formState.errors.role && (
                      <p className="text-sm font-medium text-red-500">
                        {form.formState.errors.role.message}
                      </p>
                    )}
                  </Reveal>
                  <Reveal as="div" className="mt-4 flex items-start gap-2">
                    <Controller
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          id="agreeToTerms"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
                        />
                      )}
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm text-muted-foreground"
                    >
                      I agree to the{" "}
                      <Link
                        href="/privacy"
                        target="_blank"
                        className="text-foreground underline underline-offset-4 hover:text-primary"
                      >
                        Terms & Privacy Policy
                      </Link>
                    </label>
                  </Reveal>
                  {form.formState.errors.agreeToTerms && (
                    <p className="text-sm font-medium text-red-500">
                      {form.formState.errors.agreeToTerms.message}
                    </p>
                  )}
                  <Reveal>
                    <CardFooter className="mt-6 flex-col gap-2 p-0">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting
                          ? "Creating account..."
                          : "Register"}
                      </Button>
                    </CardFooter>
                  </Reveal>
                </AuthForm>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">OR</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="mt-4">
                  <GoogleSignInButton />
                </div>
              </CardContent>
              <div className="mt-8 flex justify-center">
                <Button variant="ghost" size="sm">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <ArrowBigLeftDash className="h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </Reveal>
          </RevealGroup>
        </Card>
      </RevealGroup>
    </div>
  )
}
