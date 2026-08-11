"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useUploadMyPhoto } from "@/features/profile/hooks"
import { Camera } from "lucide-react"
import { useRef, useState } from "react"

export function ProfilePhotoUpload({
  currentPhoto,
  name,
}: {
  currentPhoto: string | null
  name: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const { mutate: upload, isPending } = useUploadMyPhoto()

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) return
    if (file.size > 3 * 1024 * 1024) return

    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)
    upload(file, {
      onSettled: () => URL.revokeObjectURL(localPreview),
    })
  }

  const displayImage = preview || currentPhoto

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="h-24 w-24 overflow-hidden rounded-full bg-primary/10">
          {displayImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayImage}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-primary">
              {initials}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:bg-primary/80 disabled:opacity-50"
          aria-label="Change photo"
        >
          {isPending ? (
            <Spinner className="size-4" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
      >
        {isPending ? "Uploading..." : "Change Photo"}
      </Button>
    </div>
  )
}
