"use client" // Fixed the Build Error

import { loginSchema, type LoginFormValues } from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import Link from "next/link"
import { sileo } from "sileo"

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: LoginFormValues) => {
    await sileo.promise(
      new Promise((resolve) => setTimeout(() => resolve(values), 1500)),
      {
        loading: { title: "Verifying credentials..." },
        success: { title: "Login successful!" },
        error: { title: "Invalid request." },
      }
    )
  }

  // The dynamic array now perfectly matches your UI requirements
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
      action: (
        <a href="#" className="text-sm underline-offset-4 hover:underline">
          Forgot your password?
        </a>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
            <CardAction>
          <Link href="/register">
              <Button variant="link">Sign Up</Button>
          </Link>
            </CardAction>
        </CardHeader>

        <CardContent>
          <AuthForm form={form} onSubmit={onSubmit} fields={loginFields}>
            {/* Passing CardFooter directly into the form via children prop */}
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
