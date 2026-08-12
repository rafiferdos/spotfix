import { cn } from "@/lib/utils"

export function UserAvatar({
  src,
  name,
  className,
}: {
  src?: string | null
  name: string
  className?: string
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary",
        className
      )}
    >
      {initials}
    </div>
  )
}
