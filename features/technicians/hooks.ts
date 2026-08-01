import { useQuery } from "@tanstack/react-query"
import { getTechnicianById, getTechnicians } from "./api"
import { TechnicianFilters } from "./types"

export const useTechnicians = (params?: TechnicianFilters) => {
  return useQuery({
    queryKey: ["technicians", params],
    queryFn: () => getTechnicians(params),
  })
}

export const useTechnician = (id: string) => {
  return useQuery({
    queryKey: ["technician", id],
    queryFn: () => getTechnicianById(id),
    enabled: !!id,
  })
}
