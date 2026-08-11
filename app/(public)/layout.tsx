// app/(public)/layout.tsx
import { Footer } from "@/components/footer"
import { ScrollElements } from "@/components/scroll-elements"
import Navbar from "@/components/shadcn-space/blocks/navbar-01/navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollElements />
    </div>
  )
}
