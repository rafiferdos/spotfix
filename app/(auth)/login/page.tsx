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

import { GoogleSignInButton } from "@/components/google-sign-in-button"
import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { loginAction } from "@/service/auth-actions"
import { useAuth } from "@/store/use-auth"
import { ArrowBigLeftDash } from "lucide-react"
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
      <RevealGroup eager as="div" className="w-full max-w-md">
        <Card>
          <Reveal>
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
          </Reveal>
          <Reveal>
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
              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="mt-4">
                <GoogleSignInButton />
              </div>
            </CardContent>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  form.setValue("email", "demo.customer@gmail.com")
                  form.setValue("password", "iamalone3r")
                }}
                className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Try a demo account
              </button>
            </div>
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
        </Card>
      </RevealGroup>
    </div>
  )
}
