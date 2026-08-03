"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Toaster } from "sileo"

export function ThemedToaster() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted on the client to get resolvedTheme correctly
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fallback state for SSR / initial render before hydration completes
  const isDark = mounted ? resolvedTheme === "dark" : true 

  // Translucent fill for Glassmorphism
  const fill = isDark
    ? "oklch(0.250 0.006 56.043 / 0.65)"
    : "oklch(0.980 0.006 56.043 / 0.70)"

  const textColor = isDark
    ? "oklch(0.985 0.001 106.423)"
    : "oklch(0.216 0.006 56.043)"

  const glassEffectClass = isDark
    ? "!backdrop-blur-xl !backdrop-saturate-180 !border !border-white/10 !shadow-[0_20px_25px_-5px_rgba(0,0,0,0.5)]"
    : "!backdrop-blur-xl !backdrop-saturate-180 !border !border-black/10 !shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08)]"

  // Prevent rendering before hydration if you want to avoid flash entirely
  if (!mounted) return null

  return (
    <Toaster
      position="bottom-center"
      options={{
        fill,
        styles: {
          badge: glassEffectClass,
          title: `!text-[${textColor}] !font-medium`,
          description: `!text-[${textColor}] !opacity-75`,
        },
      }}
    />
  )
}