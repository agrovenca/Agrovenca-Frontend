import { create } from 'zustand'

interface ProductFiltersState {
  page: number
  limit: number
  search: string
  unitiesId: string[]
  categoriesId: string[]
  priceRange: number[]
  setPriceRange: (priceRange: number[]) => void
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setSearch: (search: string) => void
  setUnitiesId: (unitiesId: string[]) => void
  setCategoriesId: (categoriesId: string[]) => void
  resetFilters: () => void
}

export const useProductFiltersStore = create<ProductFiltersState>((set) => ({
  page: 1,
  limit: 16,
  search: '',
  unitiesId: [],
  categoriesId: [],
  priceRange: [0, 1700],
  setPriceRange: (priceRange) => set({ priceRange }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSearch: (search) => set({ search }),
  setUnitiesId: (unitiesId) => set({ unitiesId }),
  setCategoriesId: (categoriesId) => set({ categoriesId }),
  resetFilters: () =>
    set({ page: 1, limit: 16, search: '', categoriesId: [], unitiesId: [], priceRange: [0, 1700] }),
}))
