// components/shadcn-space/blocks/navbar-01/navbar.tsx
"use client"
import { Logo } from "@/assets/logo/logo"
import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { UserMenu } from "@/components/user-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/store/use-auth"
import { ArrowUpRight, TextAlignJustify } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export type NavigationSection = { title: string; href: string }

const navigationData: NavigationSection[] = [
  { title: "Home", href: "/" },
  { title: "Technicians", href: "/technicians" },
  { title: "Services", href: "/services" },
  { title: "About", href: "/about" },
]

const CollaborateButton = ({ className }: { className?: string }) => (
  <Button
    render={<Link href="/register" />}
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
  const { user, isLoading } = useAuth()

  const handleScroll = useCallback(() => setSticky(window.scrollY >= 50), [])
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
          <RevealGroup
            eager
            as="nav"
            className={cn(
              "flex h-fit w-full items-center justify-between gap-3.5 transition-all duration-500 lg:gap-6",
              sticky
                ? "rounded-full border border-border/40 bg-background/60 p-2.5 shadow-2xl shadow-primary/5 backdrop-blur-lg"
                : "border-transparent bg-transparent"
            )}
          >
            <Reveal>
              <Link href="/">
                <Logo className="w-content h-5 md:h-12" />
              </Link>
            </Reveal>

            <RevealGroup
              eager
              as="div"
              className="rounded-full bg-muted p-0.5 max-lg:hidden"
            >
              <NavigationMenu>
                <NavigationMenuList className="flex gap-0">
                  {navigationData.map((navItem) => {
                    const isActive = pathname === navItem.href
                    return (
                      <Reveal key={navItem.title}>
                        <NavigationMenuItem>
                          <Link
                            href={navItem.href}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                              "block cursor-pointer rounded-full px-2 py-2 text-sm font-medium tracking-normal outline outline-transparent transition lg:px-4",
                              isActive
                                ? "bg-background text-foreground shadow-xs outline-border"
                                : "text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-xs hover:outline-border"
                            )}
                          >
                            {navItem.title}
                          </Link>
                        </NavigationMenuItem>
                      </Reveal>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </RevealGroup>

            <RevealGroup eager as="div" className="flex items-center gap-3">
              <Reveal>
                <ThemeToggle />
              </Reveal>

              {isLoading ? (
                <Reveal>
                  <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
                </Reveal>
              ) : user ? (
                <Reveal>
                  <UserMenu context="public" />
                </Reveal>
              ) : (
                <Reveal>
                  <div className="flex items-center gap-2">
                    <Button render={<Link href="/login" />} variant="ghost">
                      Log In
                    </Button>
                    <CollaborateButton className="hidden lg:flex" />
                  </div>
                </Reveal>
              )}

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
                        <DropdownMenuItem
                          key={item.title}
                          closeOnClick
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
                    {!isLoading && !user && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          closeOnClick
                          className="cursor-pointer"
                        >
                          <Link href="/register" className="w-full text-sm">
                            Join Spotfix
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </RevealGroup>
          </RevealGroup>
        </div>
      </header>
    </div>
  )
}

export default Navbar
