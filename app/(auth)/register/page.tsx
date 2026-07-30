"use client"

import { FormFieldConfig } from "@/components/shared/AuthForm"
import config from "@/config"
import { USER_ROLES } from "@/lib/constants"
import { RegisterFormValues, registerSchema } from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
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
}
