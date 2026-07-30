"use client"

import { loginSchema, type LoginFormValues } from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Cookies from "js-cookie"
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

import { useAuth } from "@/store/use-auth"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { sileo } from "sileo"
import config from "@/config"

export default function LoginPage() {
  const router = useRouter()
  
  // Fixed: Extracting the login action from Zustand and assigning it to setAuthUser
  const setAuthUser = useAuth((state) => state.login) 

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: LoginFormValues) => {
    // Creating the actual API promise
    const loginRequest = axios.post(`${config.apiUrl}/auth/login`, values)
    
    try {
      // Fixed: Passing the actual Axios request into Sileo
      const response = await sileo.promise(loginRequest, {
        loading: { title: "Verifying credentials..." },
        success: { title: "Login successful!" },
        error: { title: "Invalid email or password." },
      })
      
      const { token, user } = response.data
      
      // Fixed: Using js-cookie and correcting the boolean check
      Cookies.set("accessToken", token, {
        expires: 7,
        secure: config.isProduction, 
      })
      
      setAuthUser(user)
      router.push("/dashboard")
    } catch (error) {
      // Sileo already shows the error toast automatically via the promise tracker above.
      // We just catch the error here to prevent unhandled promise rejections.
      console.error("Authentication failed:", error)
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