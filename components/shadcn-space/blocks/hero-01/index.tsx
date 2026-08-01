import BrandSlider, {
  BrandList,
} from "@/components/shadcn-space/blocks/hero-01/brand-slider"
import type { AvatarList } from "@/components/shadcn-space/blocks/hero-01/hero"
import HeroSection from "@/components/shadcn-space/blocks/hero-01/hero"
import config from "@/config"

export default function AgencyHeroSection() {
  const token = config.logoToken
  const avatarList: AvatarList[] = [
    {
      image: "https://images.shadcnspace.com/assets/profiles/user-1.jpg",
    },
    {
      image: "https://images.shadcnspace.com/assets/profiles/user-2.jpg",
    },
    {
      image: "https://images.shadcnspace.com/assets/profiles/user-3.jpg",
    },
    {
      image: "https://images.shadcnspace.com/assets/profiles/user-5.jpg",
    },
  ]

const brandList: BrandList[] = [
  {
    image: `https://img.logo.dev/urbancompany.com?token=${token}`,
    lightimg: `https://img.logo.dev/urbancompany.com?token=${token}`,
    name: "Urban Company",
  },
  {
    image: `https://img.logo.dev/thumbtack.com?token=${token}`,
    lightimg: `https://img.logo.dev/thumbtack.com?token=${token}`,
    name: "Thumbtack",
  },
  {
    image: `https://img.logo.dev/angi.com?token=${token}`,
    lightimg: `https://img.logo.dev/angi.com?token=${token}`,
    name: "Angi",
  },
  {
    image: `https://img.logo.dev/handy.com?token=${token}`,
    lightimg: `https://img.logo.dev/handy.com?token=${token}`,
    name: "Handy",
  },
  {
    image: `https://img.logo.dev/homeserve.com?token=${token}`,
    lightimg: `https://img.logo.dev/homeserve.com?token=${token}`,
    name: "HomeServe",
  },
  {
    image: `https://img.logo.dev/taskrabbit.com?token=${token}`,
    lightimg: `https://img.logo.dev/taskrabbit.com?token=${token}`,
    name: "Taskrabbit",
  },
  {
    image: `https://img.logo.dev/porch.com?token=${token}`,
    lightimg: `https://img.logo.dev/porch.com?token=${token}`,
    name: "Porch",
  },
];

  return (
    <div className="relative">
      <main>
        <HeroSection avatarList={avatarList} />
        <BrandSlider brandList={brandList} />
      </main>
    </div>
  )
}
