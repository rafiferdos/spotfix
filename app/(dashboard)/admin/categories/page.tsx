"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import {
  useAdminCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/features/admin/hooks"
import { AlertCircle, FolderKanban, Trash2 } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"

export default function AdminCategoriesPage() {
  const { data: categories, isLoading, isError } = useAdminCategories()
  const { mutate: create, isPending: isCreating } = useCreateCategory()
  const { mutate: remove, isPending: isDeleting } = useDeleteCategory()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleCreate = () => {
    if (!name.trim() || !description.trim()) return
    create(
      { name: name.trim(), description: description.trim() },
      {
        onSuccess: () => {
          setName("")
          setDescription("")
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
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">Catalog</h1>
        <p className="mt-1 text-muted-foreground">
          Manage the service categories customers browse by.
        </p>
      </div>

      <div className="mb-8 grid gap-4 rounded-2xl border bg-card p-5">
        <div className="grid gap-2">
          <Label htmlFor="cat-name">Name</Label>
          <Input
            id="cat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Plumbing"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cat-desc">Description</Label>
          <Textarea
            id="cat-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
          />
        </div>
        <Button
          className="w-fit"
          onClick={handleCreate}
          disabled={!name.trim() || !description.trim() || isCreating}
        >
          {isCreating ? "Adding..." : "Add Category"}
        </Button>
      </div>

      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Spinner />
        </div>
      )}
      {isError && (
        <div className="flex h-40 items-center justify-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" /> Failed to load categories.
        </div>
      )}
      {!isLoading && !isError && (!categories || categories.length === 0) && (
        <p className="py-16 text-center text-muted-foreground">
          No categories yet.
        </p>
      )}
      {!isLoading && !isError && categories && categories.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-start justify-between gap-3 rounded-2xl border bg-card p-4"
            >
              <div className="flex items-start gap-2">
                <FolderKanban className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <h3 className="font-medium">{cat.name}</h3>
                  {cat.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                className="shrink-0 text-destructive hover:bg-destructive/10"
                disabled={isDeleting}
                onClick={() =>
                  confirm(`Delete "${cat.name}"?`) && remove(cat.id)
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
