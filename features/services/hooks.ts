import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { sileo } from "sileo"
import { createService, deleteService, getServices } from "./api"

// Backend error response structure
interface ErrorResponse {
  message: string
}

export const useServices = (
  params?: Record<string, string | number | boolean>
) => {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => getServices(params),
  })
}

export const useCreateService = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      sileo.success({
        title: "Created",
        description: "The service has been created successfully.",
      })
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Error",
        description:
          error.response?.data?.message ||
          "An error occurred while creating the service.",
      })
    },
  })
}

export const useDeleteService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      sileo.success({
        title: "Deleted",
        description: "The service has been removed.",
      })
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      sileo.error({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong.",
      })
    },
  })
}
