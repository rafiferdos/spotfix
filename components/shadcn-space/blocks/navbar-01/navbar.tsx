"use client"
import Logo from "@/assets/logo/logo"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { ArrowUpRight, TextAlignJustify } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export type NavigationSection = {
  title: string
  href: string
}

const navigationData: NavigationSection[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Technicians",
    href: "/technicians",
  },
  {
    title: "Services",
    href: "/services",
  },
]

const CollaborateButton = ({ className }: { className?: string }) => (
  <Button
    className={cn(
      "group relative h-10 w-fit overflow-hidden rounded-full p-1 ps-4 pe-12 text-sm font-medium transition-all duration-500 hover:bg-primary/80 hover:ps-12 hover:pe-4",
      className
    )}
  >
    <span className="relative z-10 transition-all duration-500 hover:cursor-pointer">
      Join Spotfix
    </span>
    <div className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45">
      <ArrowUpRight size={16} />
    </div>
  </Button>
)

const Navbar = () => {
  const [sticky, setSticky] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const pathname = usePathname()

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50)
  }, [])

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsOpen(false)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [handleScroll, handleResize])

  return (
    <div>
      <header className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
          <nav
            className={cn(
              "flex h-fit w-full items-center justify-between gap-3.5 transition-all duration-500 lg:gap-6",
              sticky
                ? "rounded-full border border-border/40 bg-background/60 p-2.5 shadow-2xl shadow-primary/5 backdrop-blur-lg"
                : "border-transparent bg-transparent"
            )}
          >
            <Link href="/">
              <Logo />
            </Link>

            <div>
              <NavigationMenu className="rounded-full bg-muted p-0.5 max-lg:hidden">
                <NavigationMenuList className="flex gap-0">
                  {navigationData.map((navItem) => {
                    const isActive = pathname === navItem.href

                    return (
                      <NavigationMenuItem key={navItem.title}>
                        {/* FIX: Removed legacyBehavior. Used asChild on NavigationMenuLink, placed Link inside. */}
                        <NavigationMenuLink
                          active={isActive}
                          className={cn(
                            "block cursor-pointer rounded-full px-2 py-2 text-sm font-medium tracking-normal outline outline-transparent transition lg:px-4",
                            isActive
                              ? "bg-background text-foreground shadow-xs outline-border"
                              : "text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-xs hover:outline-border"
                          )}
                        >
                          <Link href={navItem.href}>{navItem.title}</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <CollaborateButton className="hidden lg:flex" />

            <div className="lg:hidden">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger className="flex cursor-pointer items-center justify-center rounded-full border border-border bg-background p-2 transition-colors outline-none">
                  <TextAlignJustify size={20} />
                  <span className="sr-only">Menu</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="mt-2 w-56">
                  {navigationData.map((item) => {
                    const isActive = pathname === item.href

                    return (
                      /* FIX: Removed asChild. Handled the click event on the DropdownMenuItem to close the menu, and placed the standard Link inside. */
                      <DropdownMenuItem
                        key={item.title}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "cursor-pointer",
                          isActive && "bg-muted/50"
                        )}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "w-full text-sm",
                            isActive
                              ? "font-bold text-primary"
                              : "font-medium text-foreground"
                          )}
                        >
                          {item.title}
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default Navbar
