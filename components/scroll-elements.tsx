"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUp } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const NAV_LINKS = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services" },
  { title: "Technicians", href: "/technicians" },
  { title: "About", href: "/about" },
]

export function ScrollElements() {
  const { scrollY } = useScroll()
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  // Detect scroll position
  useMotionValueEvent(scrollY, "change", (latest) => {
    // স্ক্রল ২০০ পিক্সেল ক্রস করলে কম্পোনেন্টগুলো ভিজিবল হবে
    setIsVisible(latest > 200)
  })

  // Smooth scroll logic
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* 1. Floating Sticky Navbar (Pill Design) */}
          <motion.div
            initial={{ y: 50, opacity: 0 }} // নিচ থেকে আসার অ্যানিমেশন
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-6 right-0 left-0 z-50 mx-auto w-fit"
          >
            <nav className="flex items-center gap-2 rounded-full border border-border/50 bg-background/60 px-4 py-2 shadow-lg backdrop-blur-xl">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="relative z-10">{link.title}</span>

                    {/* Active State Fluid Background */}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-pill"
                        className="absolute inset-0 z-0 rounded-full bg-primary/10"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>
          </motion.div>

          {/* 2. Scroll to Top Button */}
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.1, // একটু দেরিতে আসবে ন্যাভবারের পর
            }}
            className="fixed right-8 bottom-8 z-50"
          >
            <Button
              onClick={scrollToTop}
              size="icon"
              className="h-12 w-12 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
