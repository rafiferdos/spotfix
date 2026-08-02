"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useServices } from "@/features/services/hooks"

export default function CustomerDashboard() {
  const { data: services, isLoading, isError } = useServices()

  if (isLoading) return <Spinner />
  if (isError) return <div className="text-red-500">Error loading services</div>

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {services?.map((service, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{service.title}</CardTitle>
            <CardDescription>{service.description}</CardDescription>
            <CardAction>
              <Button>Book Now</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>Price: ${service.price}</p>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      ))}
    </div>
  )
}
