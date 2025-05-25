import { Category } from '@/types/category'
import { create } from 'zustand'

interface CategoryState {
  categories: Category[]
  setCategories: (data: Category[]) => void
  hasCategories: () => boolean
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  setCategories: (data) => set({ categories: data }),
  hasCategories: () => get().categories.length > 0,
}))
