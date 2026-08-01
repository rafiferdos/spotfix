import FeaturedServices from "@/components/featuredServices"
import FeaturedTechnicians from "@/components/featuredTechnicians"
import AgencyHeroSection from "@/components/shadcn-space/blocks/hero-01"

export default function Page() {
  return (
    <>
      <AgencyHeroSection />
      <FeaturedServices />
      {/* <Team /> */}
      <FeaturedTechnicians />
    </>
  )
}
