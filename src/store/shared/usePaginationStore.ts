import { create } from 'zustand'

interface PaginationData {
  page: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextPage: number | null
  previousPage: number | null
}

interface PaginationStore {
  paginationData: PaginationData | null
  setPaginationData: (data: PaginationData) => void
  clearPaginationData: () => void
}

export const usePaginationStore = create<PaginationStore>((set) => ({
  paginationData: null,
  setPaginationData: (data) => set({ paginationData: data }),
  clearPaginationData: () => set({ paginationData: null }),
}))
