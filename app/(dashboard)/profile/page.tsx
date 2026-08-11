"use client"

import { ProfilePhotoUpload } from "@/components/profile-photo-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  useChangeMyPassword,
  useMyProfile,
  useUpdateMyProfile,
} from "@/features/profile/hooks"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

export default function ProfileSettingsPage() {
  const { data: profile, isLoading } = useMyProfile()
  const { mutate: saveProfile, isPending: isSaving } = useUpdateMyProfile()
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangeMyPassword()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(profile.name)
      setPhone(profile.phone ?? "")
      setAddress(profile.address ?? "")
    }
  }, [profile])

  if (isLoading || !profile) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-2xl p-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-[-0.02em]">Account</h1>
        <p className="mt-1 text-muted-foreground">
          Update your personal information and photo.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border bg-card p-6">
        <ProfilePhotoUpload
          currentPhoto={profile.profileImage}
          name={profile.name}
        />

        <div className="grid gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label>Email</Label>
          <Input value={profile.email} disabled />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <Button
          className="w-full"
          disabled={isSaving || !name.trim()}
          onClick={() => saveProfile({ name: name.trim(), phone, address })}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="mt-6 space-y-4 rounded-2xl border bg-card p-6">
        <div>
          <h2 className="font-medium">Change Password</h2>
          <p className="text-sm text-muted-foreground">
            Use a strong password you don&apos;t use elsewhere.
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="old-password">Current password</Label>
          <Input
            id="old-password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="w-full"
          disabled={
            isChangingPassword || !oldPassword || newPassword.length < 6
          }
          onClick={() => {
            changePassword(
              { oldPassword, newPassword },
              {
                onSuccess: () => {
                  setOldPassword("")
                  setNewPassword("")
                },
              }
            )
          }}
        >
          {isChangingPassword ? "Changing..." : "Change Password"}
        </Button>
      </div>
    </motion.div>
  )
}
