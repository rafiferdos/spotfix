import { useAuth } from "@/store/use-auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { sileo } from "sileo"

import {
  changeMyPassword,
  getMyProfile,
  updateMyProfile,
  uploadMyProfilePhoto,
} from "./api"
import { ChangePasswordPayload, UpdateProfilePayload } from "./types"

interface ErrorResponse {
  message: string
}

export const useMyProfile = () =>
  useQuery({ queryKey: ["profile", "me"], queryFn: getMyProfile })

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient()
  const syncAuth = useAuth((s) => s.login)
  const currentUser = useAuth((s) => s.user)

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMyProfile(payload),
    onSuccess: (data) => {
      sileo.success({ title: "Profile updated" })
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] })
      if (currentUser) {
        syncAuth({ ...currentUser, ...data } as typeof currentUser)
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Update failed",
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useUploadMyPhoto = () => {
  const queryClient = useQueryClient()
  const syncAuth = useAuth((s) => s.login)
  const currentUser = useAuth((s) => s.user)

  return useMutation({
    mutationFn: (file: File) => uploadMyProfilePhoto(file),
    onSuccess: (data) => {
      sileo.success({ title: "Photo updated" })
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] })
      if (currentUser) {
        syncAuth({ ...currentUser, ...data } as typeof currentUser)
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Photo upload failed",
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}

export const useChangeMyPassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changeMyPassword(payload),
    onSuccess: () => {
      sileo.success({ title: "Password changed successfully" })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Password change failed",
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}
