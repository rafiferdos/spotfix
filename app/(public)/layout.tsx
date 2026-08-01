import { Geist_Mono, Montserrat, Outfit } from "next/font/google"

import { Footer } from "@/components/footer"
import AuthProvider from "@/components/providers/auth-provider"
import QueryProvider from "@/components/providers/query-provider"
import Navbar from "@/components/shadcn-space/blocks/navbar-01/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "sileo"

const outfitHeading = Outfit({ subsets: ["latin"], variable: "--font-heading" })

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        montserrat.variable,
        outfitHeading.variable
      )}
    >
      <body suppressHydrationWarning>
        <Toaster position="top-center" theme="system" />
        <Navbar />
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  )
}
