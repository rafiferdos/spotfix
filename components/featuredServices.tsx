"use client"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import Features from "./features"
import { Button } from "./ui/button"

const FeaturedServices = () => {
  return (
    <section>
      <div className="relative h-full w-full">
        <div className="relative w-full pt-0 pb-6 before:absolute before:top-24 before:-z-10 before:h-full before:w-full before:rounded-full before:bg-linear-to-r before:from-sky-100 before:via-white before:to-amber-100 before:blur-3xl md:pt-20 md:pb-10 dark:before:-z-10 dark:before:rounded-full dark:before:from-slate-800 dark:before:via-black dark:before:to-stone-700 dark:before:blur-3xl">
          <div className="relative z-10 container mx-auto">
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
              <Features />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mx-auto w-fit gap-8"
            >
              <Link href="/services" passHref>
                <Button className="group relative h-12 w-fit cursor-pointer overflow-hidden rounded-full p-1 ps-6 pe-14 text-sm font-medium transition-all duration-500 hover:ps-14 hover:pe-6">
                  <span className="relative z-10 transition-all duration-500">
                    Get More
                  </span>
                  <span className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                    <ArrowUpRight size={16} />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedServices
