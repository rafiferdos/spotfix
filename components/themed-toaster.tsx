"use client"

import { useTheme } from "next-themes"
import { Toaster } from "sileo"

export function ThemedToaster() {
  const { resolvedTheme } = useTheme()

  // Dark mode → dark-gray card; Light mode → pure dark (near-black) card
  const fill =
    resolvedTheme === "dark"
      ? "oklch(0.216 0.006 56.043)" // dark gray (existing --card in .dark)
      : "oklch(0.147 0.004 49.25)" // near-black (existing --foreground in :root)

  const textColor = "oklch(0.985 0.001 106.423)"

  return (
    <Toaster
      position="top-center"
      options={{
        fill,
        styles: {
          title: `!text-[${textColor}]`,
          description: `!text-[${textColor}] !opacity-70`,
        },
      }}
    />
  )
}
