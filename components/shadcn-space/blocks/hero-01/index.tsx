import BrandSlider, {
  BrandList,
} from "@/components/shadcn-space/blocks/hero-01/brand-slider"
import type { AvatarList } from "@/components/shadcn-space/blocks/hero-01/hero"
import HeroSection from "@/components/shadcn-space/blocks/hero-01/hero"

export default function AgencyHeroSection() {
  const avatarList: AvatarList[] = [
    {
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      image: "https://randomuser.me/api/portraits/men/68.jpg",
    },
    {
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ]

  const brandList: BrandList[] = [
    {
      image: "https://cdn.simpleicons.org/bosch",
      lightimg: "https://cdn.simpleicons.org/bosch/ffffff",
      name: "Bosch",
    },
    {
      image: "https://cdn.simpleicons.org/samsung",
      lightimg: "https://cdn.simpleicons.org/samsung/ffffff",
      name: "Samsung",
    },
    {
      image: "https://cdn.simpleicons.org/lg",
      lightimg: "https://cdn.simpleicons.org/lg/ffffff",
      name: "LG",
    },
    {
      image: "https://cdn.simpleicons.org/panasonic",
      lightimg: "https://cdn.simpleicons.org/panasonic/ffffff",
      name: "Panasonic",
    },
    {
      image: "https://cdn.simpleicons.org/philips",
      lightimg: "https://cdn.simpleicons.org/philips/ffffff",
      name: "Philips",
    },
    {
      image: "https://cdn.simpleicons.org/siemens",
      lightimg: "https://cdn.simpleicons.org/siemens/ffffff",
      name: "Siemens",
    },
    {
      image: "https://cdn.simpleicons.org/ikea",
      lightimg: "https://cdn.simpleicons.org/ikea/ffffff",
      name: "IKEA",
    },
  ]

  return (
    <div className="relative">
      <main>
        <HeroSection avatarList={avatarList} />
        <BrandSlider brandList={brandList} />
      </main>
    </div>
  )
}
