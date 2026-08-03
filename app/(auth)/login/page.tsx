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
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { loginAction } from "@/service/auth-actions"
import { useAuth } from "@/store/use-auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { sileo } from "sileo"

export default function LoginPage() {
  const router = useRouter()

  // Fixed: Extracting the login action from Zustand and assigning it to setAuthUser
  const setAuthUser = useAuth((state) => state.login)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: LoginFormValues) => {
    const loginRequest = loginAction(values.email, values.password)

    try {
      const response = await sileo.promise(loginRequest, {
        loading: { title: "Verifying credentials..." },
        success: { title: "Login successful!" },
        error: { title: "Invalid email or password." },
      })

      const user = response.data.user
      setAuthUser(user)

      if (user.role === "ADMIN") router.push("/admin")
      else if (user.role === "TECHNICIAN") router.push("/technician")
      else router.push("/customer")
    } catch {
      sileo.error({
        title: "Login failed",
        description: "Please check your credentials and try again.",
      })
    }
  }

  const loginFields: FormFieldConfig<LoginFormValues>[] = [
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
      // action: (
      //   <a href="#" className="text-sm underline-offset-4 hover:underline">
      //     Forgot your password?
      //   </a>
      // ),
    },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to Spotfix</CardTitle>
          <CardDescription>
            Fill in your credentials to access your account.
          </CardDescription>
          <CardAction>
            <Link href="/register">
              <Button variant="link">Sign Up</Button>
            </Link>
          </CardAction>
        </CardHeader>

        <CardContent>
          <AuthForm form={form} onSubmit={onSubmit} fields={loginFields}>
            <CardFooter className="mt-6 flex-col gap-2 p-0">
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </AuthForm>
        </CardContent>
      </Card>
    </div>
  )
}
