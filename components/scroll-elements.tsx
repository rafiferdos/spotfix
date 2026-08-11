"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUp, Menu, X } from "lucide-react"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Detect scroll position
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 200)
    if (latest <= 200) setIsMobileMenuOpen(false)
  })

  // Smooth scroll logic
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* 1. DESKTOP & TABLET: Bottom Floating Navbar (Hidden on mobile) */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed right-0 bottom-8 left-0 z-50 mx-auto hidden w-fit sm:block"
          >
            <nav className="flex items-center gap-1.5 rounded-full border border-border/30 bg-background/20 px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl supports-[backdrop-filter]:bg-background/20 dark:border-white/10">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    <span className="relative z-10">{link.title}</span>
                    {isActive && (
                      <motion.div
                        layoutId="desktop-nav-pill"
                        className="absolute inset-0 z-0 rounded-full bg-primary/15 shadow-sm"
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

          {/* 2. ALL DEVICES: Bottom Right Controls Stack */}
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.1,
            }}
            className="fixed right-4 bottom-6 z-50 flex flex-col items-end gap-3 sm:right-8 sm:bottom-8"
          >
            {/* Mobile Menu Popup */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  style={{ transformOrigin: "bottom right" }}
                  className="mb-2 flex w-48 flex-col gap-1 rounded-2xl border border-border/30 bg-background/40 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-3xl sm:hidden dark:border-white/10"
                >
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "relative flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/15 text-primary"
                            : "text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
                        )}
                      >
                        {link.title}
                      </Link>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons Stack */}
            <div className="flex flex-col gap-3">
              {/* Scroll to Top Button (Visible everywhere) */}
              <Button
                onClick={scrollToTop}
                size="icon"
                className="h-12 w-12 rounded-full border border-border/30 bg-background/40 text-foreground shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition-all hover:scale-110 hover:bg-background/60 active:scale-95 dark:border-white/10"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>

              {/* Mobile Hamburger Button (Hidden on tablet/desktop) */}
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                size="icon"
                className="h-12 w-12 rounded-full border border-border/30 bg-background/40 text-foreground shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition-all hover:scale-110 hover:bg-background/60 active:scale-95 sm:hidden dark:border-white/10"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
