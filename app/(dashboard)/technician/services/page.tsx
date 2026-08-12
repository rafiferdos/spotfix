"use client"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useCategories } from "@/features/categories/hooks"
import {
  useCreateService,
  useDeleteService,
  useServices,
} from "@/features/services/hooks"
import { useAuth } from "@/store/use-auth"
import { AlertCircle, Trash2, Wrench } from "lucide-react"
import { motion } from "motion/react"
import { useMemo, useState } from "react"

export default function TechnicianServicesPage() {
  const { user } = useAuth()
  const { data: allServices, isLoading, isError } = useServices()
  const { data: categories } = useCategories()
  const { mutate: create, isPending } = useCreateService()
  const { mutate: removeService, isPending: isDeleting } = useDeleteService()

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    title: string
  } | null>(null)

  const confirmDelete = () => {
    if (!deleteTarget) return
    removeService(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  const myServices = useMemo(
    () => allServices?.filter((s) => s.technicianId === user?.id) ?? [],
    [allServices, user?.id]
  )

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setPrice("")
    setCategoryId("")
  }

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !price || !categoryId || !user)
      return
    create(
      {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        categoryId,
        technicianId: user.id,
      },
      {
        onSuccess: () => {
          setOpen(false)
          resetForm()
        },
      }
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-4xl p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-[-0.02em]">Services</h1>
          <p className="mt-1 text-muted-foreground">
            The services you offer to customers.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button>Add Service</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a Service</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="svc-title">Title</Label>
                <Input
                  id="svc-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AC Repair & Maintenance"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="svc-desc">Description</Label>
                <Textarea
                  id="svc-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's included in this service?"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="svc-price">Price (৳)</Label>
                <Input
                  id="svc-price"
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="svc-category">Category</Label>
                <Select
                  value={categoryId}
                  onValueChange={(value) => setCategoryId(value ?? "")}
                >
                  <SelectTrigger id="svc-category" className="w-full">
                    <SelectValue placeholder="Select a category">
                      {categoryId
                        ? categories?.find((c) => c.id === categoryId)?.name
                        : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSubmit}
                disabled={
                  !title.trim() ||
                  !description.trim() ||
                  !price ||
                  !categoryId ||
                  isPending
                }
              >
                {isPending ? "Adding..." : "Add Service"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Spinner />
        </div>
      )}
      {isError && (
        <div className="flex h-40 items-center justify-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" /> Failed to load services.
        </div>
      )}
      {!isLoading && !isError && myServices.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          You haven&apos;t added any services yet.
        </p>
      )}

      {!isLoading && !isError && myServices.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {myServices.map((service) => (
            <div key={service.id} className="rounded-2xl border bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">{service.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() =>
                    setDeleteTarget({ id: service.id, title: service.title })
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {service.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-muted-foreground">
                  {service.category.name}
                </span>
                <span className="font-medium text-primary">
                  ৳{service.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this service?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently removed. This can't be undone.`
            : undefined
        }
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={confirmDelete}
      />
    </motion.div>
  )
}
