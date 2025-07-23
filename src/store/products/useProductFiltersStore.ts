import { create } from 'zustand'

interface ProductFiltersState {
  page: number
  limit: number
  search: string
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setSearch: (search: string) => void
  resetFilters: () => void
}

export const useProductFiltersStore = create<ProductFiltersState>((set) => ({
  page: 1,
  limit: 12,
  search: '',
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSearch: (search) => set({ search }),
  resetFilters: () => set({ page: 1, limit: 12, search: '' }),
}))
