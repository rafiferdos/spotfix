// components/footer.tsx
"use client"
import Logo from "@/assets/logo/spotfix.png"
import { FacebookIcon } from "@/components/icons/facebook-icon"
import { InstagramIcon } from "@/components/icons/instagram-icon"
import { LinkedinIcon } from "@/components/icons/linkedin-icon"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"
import Link from "next/link"
import type { ReactNode } from "react"
import { Reveal, RevealGroup } from "./motion/reveal"
import Image from "next/image"

type FooterLink = { title: string; href: string; icon?: ReactNode }
type FooterSection = { label: string; links: FooterLink[] }

const footerLinks: FooterSection[] = [
  {
    label: "Explore",
    links: [
      { title: "Browse Services", href: "/services" },
      { title: "Find Technicians", href: "/technicians" },
      { title: "Privacy & Terms", href: "/privacy" },
    ],
  },
  {
    label: "Account",
    links: [
      { title: "Log In", href: "/login" },
      { title: "Join Spotfix", href: "/register" },
    ],
  },
  {
    label: "Follow Us",
    links: [
      {
        title: "Facebook",
        href: "https://facebook.com/rafiferdos2",
        icon: <FacebookIcon />,
      },
      {
        title: "Instagram",
        href: "https://instagram.com/rafiferdos",
        icon: <InstagramIcon />,
      },
      {
        title: "LinkedIn",
        href: "https://linkedin.com/in/rafiferdos",
        icon: <LinkedinIcon />,
      },
    ],
  },
]

export function Footer() {
  return (
    <RevealGroup
      eager
      className={cn(
        "md:rounded-t-6xl relative mx-auto flex w-full max-w-5xl flex-col items-center justify-center rounded-t-4xl border-t px-6 md:px-8",
        "dark:bg-[radial-gradient(35%_128px_at_50%_0%,--theme(--color-foreground/.1),transparent)]"
      )}
    >
      <div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/20 blur" />
      <div className="grid w-full gap-8 py-6 md:py-8 lg:grid-cols-3 lg:gap-8">
        <AnimatedContainer className="space-y-4">
          <Image src={Logo} alt="Spotfix Logo" className="h-10 w-auto" />
          <p className="mt-8 text-sm text-muted-foreground md:mt-0">
            Book trusted, verified home service professionals in minutes.
          </p>
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-2 lg:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer delay={0.1 + index * 0.1} key={section.label}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs">{section.label}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        className="inline-flex items-center duration-250 hover:text-foreground [&_svg]:me-1.5 [&_svg]:size-3.5"
                        href={link.href}
                        target={
                          link.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          link.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {link.icon}
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
      <div className="h-px w-full bg-linear-to-r via-border" />
      <Reveal as="div" className="flex w-full items-center justify-center py-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Spotfix. All rights reserved.
        </p>
      </Reveal>
    </RevealGroup>
  )
}

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: {
  delay?: number
  className?: string
  children: ReactNode
}) {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) return children
  return (
    <motion.div
      className={className}
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      transition={{ delay, duration: 0.8 }}
      viewport={{ once: true }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
    >
      {children}
    </motion.div>
  )
}
