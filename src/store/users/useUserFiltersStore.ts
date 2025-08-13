import { create } from 'zustand'

interface UserFiltersState {
  page: number
  limit: number
  search: string
  isActive: 'active' | 'inactive' | undefined
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setSearch: (search: string) => void
  setIsActive: (isActive: 'active' | 'inactive' | undefined) => void
  resetFilters: () => void
}

export const useUserFiltersStore = create<UserFiltersState>((set) => ({
  page: 1,
  limit: 16,
  search: '',
  isActive: undefined,
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSearch: (search) => set({ search }),
  setIsActive: (isActive) => set({ isActive }),
  resetFilters: () => set({ page: 1, limit: 16, search: '', isActive: undefined }),
}))
