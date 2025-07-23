import { create } from 'zustand'

interface ProductFiltersState {
  page: number
  limit: number
  search: string
  categoriesId: string[]
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setSearch: (search: string) => void
  setCategoriesId: (categoriesId: string[]) => void
  resetFilters: () => void
}

export const useProductFiltersStore = create<ProductFiltersState>((set) => ({
  page: 1,
  limit: 16,
  search: '',
  categoriesId: [],
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSearch: (search) => set({ search }),
  setCategoriesId: (categoriesId) => set({ categoriesId }),
  resetFilters: () => set({ page: 1, limit: 16, search: '', categoriesId: [] }),
}))
