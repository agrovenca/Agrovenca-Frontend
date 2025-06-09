import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types/product'

interface SavedState {
  products: Product[]
  addProduct: (item: Product) => void
  removeProduct: (productId: string) => void
  clear: () => void
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (item) =>
        set((state) => ({
          products: [...state.products, item],
        })),
      removeProduct: (productId: string) =>
        set((state) => ({
          products: state.products.filter((item) => item.id !== productId),
        })),
      clear: () => set(() => ({ products: [] })),
    }),
    {
      name: 'saved-storage',
    }
  )
)
