"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateService } from "@/features/services/hooks"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  // Just use z.number() directly
  price: z.number().min(1, "Price must be greater than 0."),
  description: z
    .string()
    .min(10, "Description needs to be at least 10 characters."),
})

type FormValues = z.infer<typeof formSchema>

export function AddServiceModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: createService, isPending } = useCreateService()

  // 2. Pure react-hook-form initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  // 3. Submit Handler
  const onSubmit = (values: FormValues) => {
    const payload = {
      ...values,
      isAvailable: true,
      category: "GENERAL",
    }

    createService(payload, {
      onSuccess: () => {
        setIsOpen(false)
        reset() // Reset form states instantly
      },
    })
  }

  // Handle manual modal close
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button>Add New Service</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Service</DialogTitle>
        </DialogHeader>

        {/* 4. Standard HTML form without shadcn Form wrapper */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              placeholder="e.g. AC Repair"
              {...register("name")} // Directly register the input
            />
            {errors.name && (
              <p className="text-sm font-medium text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="any"
              placeholder="0.00"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm font-medium text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detail about the service..."
              className="resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm font-medium text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Save Service"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
