"use client"

import { Toaster } from "sileo"

// hardcoded from app/globals.css `.dark` block — popover/popover-foreground
const TOAST_BG = "oklch(0.216 0.006 56.043)"
const TOAST_TEXT = "oklch(0.985_0.001_106.423)" // underscored for Tailwind arbitrary value

export function ThemedToaster() {
  return (
    <Toaster
      position="top-center"
      fill={TOAST_BG}
      styles={{
        title: `!text-[${TOAST_TEXT}]`,
        description: `!text-[${TOAST_TEXT}] !opacity-70`,
      }}
    />
  )
}
