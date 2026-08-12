"use client"

import { googleLoginAction } from "@/service/auth-actions"
import { useAuth } from "@/store/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { sileo } from "sileo"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any
  }
}

export function GoogleSignInButton() {
  const router = useRouter()
  const setAuthUser = useAuth((s) => s.login)
  const btnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scriptId = "google-identity-script"
    if (document.getElementById(scriptId)) {
      initGoogle()
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.id = scriptId
    script.async = true
    script.defer = true
    script.onload = initGoogle
    document.body.appendChild(script)

    function initGoogle() {
      if (!window.google || !btnRef.current) return
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredential,
      })
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
        shape: "pill",
      })
    }

    async function handleCredential(response: { credential: string }) {
      try {
        const result = await googleLoginAction(response.credential)
        if (!result.success) {
          sileo.error({
            title: "Google sign-in failed",
            description: result.message,
          })
          return
        }
        const user = result.data.user
        setAuthUser(user)
        sileo.success({ title: "Signed in with Google!" })
        if (user.role === "ADMIN") router.push("/admin")
        else if (user.role === "TECHNICIAN") router.push("/technician")
        else router.push("/customer")
      } catch {
        sileo.error({
          title: "Google sign-in failed",
          description: "Please try again.",
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={btnRef} className="flex w-full justify-center" />
}
