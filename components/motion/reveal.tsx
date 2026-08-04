"use client"

import { motion, useReducedMotion, type Variants } from "motion/react"

const EASE = [0.22, 1, 0.36, 1] as const

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
}

interface RevealGroupProps {
  children: React.ReactNode
  className?: string
  /** true = animate on mount (hero/navbar, already in view). false = animate on scroll into view. */
  eager?: boolean
  as?: "div" | "ul" | "nav" | "section"
}

/** Parent: orchestrates staggered entrance for its direct <Reveal> children. */
export function RevealGroup({
  children,
  className,
  eager = false,
  as = "div",
}: RevealGroupProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]

  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      {...(eager
        ? { animate: "show" }
        : {
            whileInView: "show",
            viewport: { once: true, margin: "-10% 0px" },
          })}
    >
      {children}
    </MotionTag>
  )
}

interface RevealProps {
  children: React.ReactNode
  className?: string
  as?: "div" | "li" | "span" | "h1" | "h2" | "p"
}

/** Child: no own trigger — inherits "show"/"hidden" from the nearest RevealGroup. */
export function Reveal({ children, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion()
  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }
  const MotionTag = motion[as]
  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  )
}
