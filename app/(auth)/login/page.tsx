import { FormFieldConfig } from "@/components/shared/AuthForm"
import { LoginFormValues, loginSchema } from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { sileo } from "sileo"

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    await sileo.promise(
      new Promise((resolve) => setTimeout(() => resolve(values), 1500)),
      {
        loading: { title: "Verifying credentials..." },
        success: { title: "Login successful!" },
        error: { title: "Invalid email or password." },
      }
    )
  }

  const loginFields: FormFieldConfig<LoginFormValues>[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email"
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password"
    }
  ]

  return (
    
  )
}
