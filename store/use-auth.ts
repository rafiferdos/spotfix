import { UserRole } from "@/lib/constants"
import { create } from "zustand"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  status: string
  address: string
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  setLoading: (status: boolean) => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
  setLoading: (status) => set({ isLoading: status }),
}))
