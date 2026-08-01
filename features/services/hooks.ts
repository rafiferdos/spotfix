import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sileo } from "sileo"
import { createService, getServices } from "./api"

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      sileo.error({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "An error occurred while creating the service.",
      })
    },
  })
}
