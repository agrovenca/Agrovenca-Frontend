import { Category } from '@/types/category'
import { create } from 'zustand'

interface CategoriesState {
  categories: Category[]
  setCategories: (data: Category[]) => void
  updateCategory: (updatedProduct: Category) => void
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  setCategories: (data) => set({ categories: data }),
  updateCategory: (updatedCategory) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      ),
    })),
}))
