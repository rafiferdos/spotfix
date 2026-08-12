import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { TechnicianType } from "@/features/technicians/types"
import { Briefcase, MapPin } from "lucide-react"
import Link from "next/link"
import { UserAvatar } from "./user-avatar"

export function TechnicianCard({ technician }: { technician: TechnicianType }) {
  console.log(technician.user.profileImage)
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <UserAvatar
            src={technician.user.profileImage}
            name={technician.user.name}
            className="h-12 w-12 text-base"
          />
          <div className="min-w-0">
            <h3 className="truncate text-base font-medium">
              {technician.user.name}
            </h3>
            {technician.user.address && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{technician.user.address}</span>
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {technician.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5" />
            {technician.experience} yrs experience
          </span>
          <span className="font-medium text-primary">
            ৳{technician.pricing}/hr
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          render={<Link href={`/technicians/${technician.userId}`} />}
          className="w-full"
          nativeButton={false}
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  )
}
