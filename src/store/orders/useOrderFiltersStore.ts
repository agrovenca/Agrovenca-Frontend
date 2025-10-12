import { create } from 'zustand'
import { limitOptions } from '@/lib/orderLimitOptions'

const initialLimit = Number(limitOptions[0].value)

interface OrderFiltersState {
  page: number
  limit: number
  search: string
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setSearch: (search: string) => void
  resetFilters: () => void
}

export const useOrderFiltersStore = create<OrderFiltersState>((set) => ({
  page: 1,
  limit: initialLimit,
  search: '',
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSearch: (search) => set({ search }),
  resetFilters: () => set({ page: 1, limit: initialLimit, search: '' }),
}))
