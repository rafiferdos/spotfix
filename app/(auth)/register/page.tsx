"use client"

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
import config from "@/config"
import { USER_ROLES } from "@/lib/constants"
import { RegisterFormValues, registerSchema } from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { sileo } from "sileo"

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
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    const registerRequest = axios.post(`${config.apiUrl}/auth/register`, values)

    try {
      const response = await sileo.promise(registerRequest, {
        loading: { title: "Creating your account..." },
        success: { title: "Account created successfully!" },
        error: { title: "Registration failed. Please try again." },
      })
      router.push("/login")
    } catch (error) {
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
    {
      name: "phone",
      label: "Phone",
      type: "text",
      placeholder: "+1234567890",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "123 Main St, City, Country",
    },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Join Spotfix</CardTitle>
          <CardDescription>
            Create an account to get started with Spotfix. Fill in your details
            below to register.
          </CardDescription>
          <CardAction>
            <Link href="/login">
              <Button variant="link">Log In</Button>
            </Link>
          </CardAction>
        </CardHeader>

        <CardContent>
          <AuthForm form={form} onSubmit={onSubmit} fields={registerFields}>
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
          </AuthForm>
        </CardContent>
      </Card>
    </div>
  )
}
