import { Marquee } from "@/components/shadcn-space/animations/marquee"
import { Droplets, Paintbrush, Sparkles, Wrench, Zap } from "lucide-react"

// Real-looking fictional home service brands
const HOME_SERVICE_BRANDS = [
  { name: "ElectriCare", icon: Zap },
  { name: "PlumbPro", icon: Droplets },
  { name: "PaintMasters", icon: Paintbrush },
  { name: "FixIt Heroes", icon: Wrench },
  { name: "CleanSweep", icon: Sparkles },
]

export function BrandSlider() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 pt-10 sm:pt-16">
      <p className="text-sm font-medium text-muted-foreground">
        Loved by 100+ home service brands around the world
      </p>

      <div className="relative flex w-full max-w-5xl flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:40s]">
          {HOME_SERVICE_BRANDS.map((Brand, idx) => (
            <div
              key={idx}
              className="mx-8 flex items-center gap-2.5 text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              <Brand.icon className="h-6 w-6" />
              <span className="text-xl font-bold tracking-tight">
                {Brand.name}
              </span>
            </div>
          ))}
        </Marquee>

        {/* Gradient masks for smooth fading at the edges */}
        {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-background rounded-4xl"></div> */}
        {/* <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-background rounded-4xl"></div> */}
      </div>
    </div>
  )
}
