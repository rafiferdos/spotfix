import { axiosInstance } from "@/lib/axios"
import {
  ChangePasswordPayload,
  ProfileUser,
  UpdateProfilePayload,
} from "./types"

export const getMyProfile = async (): Promise<ProfileUser> => {
  const res = await axiosInstance.get("/users/me")
  return res.data.data
}

export const updateMyProfile = async (
  payload: UpdateProfilePayload
): Promise<ProfileUser> => {
  const res = await axiosInstance.patch("/users/me", payload)
  return res.data.data
}

export const uploadMyProfilePhoto = async (
  file: File
): Promise<ProfileUser> => {
  const formData = new FormData()
  formData.append("profileImage", file)
  const res = await axiosInstance.patch("/users/me/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data.data
}

export const changeMyPassword = async (
  payload: ChangePasswordPayload
): Promise<void> => {
  await axiosInstance.patch("/users/me/password", payload)
}
