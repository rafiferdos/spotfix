import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import { Mail, Terminal, Wrench } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import profileImg from "@/assets/rafi.png"
import { Github, Linkedin } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function AboutPage() {
  return (
    <RevealGroup
      as="div"
      eager
      className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center px-6"
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Header Section */}
        <Reveal className="mb-16 text-center">
          <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Behind <span className="text-primary">SpotFix</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A comprehensive service booking platform engineered from scratch to
            bridge the gap between skilled professionals and everyday customers.
          </p>
        </Reveal>

        {/* Profile Section */}
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image & Socials */}
          <Reveal className="flex flex-col items-center gap-6">
            <div className="relative aspect-square w-64 overflow-hidden rounded-full border-4 border-muted shadow-xl sm:w-80">
              <Image
                src={profileImg}
                alt="MD. Rafi Ferdos"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                placeholder="blur"
              />
            </div>

            <div className="flex gap-4">
              <Button variant="outline" size="icon">
                <Link href="https://github.com/rafiferdos" target="_blank">
                  <HugeiconsIcon icon={Github} className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="icon">
                <Link href="https://linkedin.com/in/rafiferdos" target="_blank">
                  <HugeiconsIcon icon={Linkedin} className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="icon">
                <Link href="mailto:your.email@example.com">
                  <Mail className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </Reveal>

          {/* Bio & Details */}
          <Reveal className="flex flex-col justify-center space-y-6">
            <div>
              <h2 className="text-3xl font-semibold text-foreground">
                MD. Rafi Ferdos
              </h2>
              <p className="mt-1 text-lg font-medium text-primary">
                Full-Stack Engineer & Creator
              </p>
            </div>

            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Building SpotFix wasn&apos;t just about writing code; it was
                about designing a scalable ecosystem. From crafting the complex
                role-based access control (Admin, Technician, Customer) to
                integrating seamless payment gateways and interactive
                scheduling, every module was built solo to ensure maximum
                performance and security.
              </p>
              <p>
                My focus remains on clean architectures, utilizing modern tools
                like Next.js, React Query, Zustand, and Tailwind CSS to deliver
                an enterprise-grade user experience.
              </p>
            </div>

            {/* Quick Highlights */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
                <Terminal className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Solo Engineered</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
                <Wrench className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">
                  MERN / Next.js Stack
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </RevealGroup>
  )
}
