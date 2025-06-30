import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types/product'

interface SavedState {
  products: Product[]
  addProduct: (item: Product) => void
  removeProduct: (productId: string) => void
  isProductSaved: (productId: string) => boolean
  clear: () => void
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (item) =>
        set((state) =>
          get().products.some((product) => product.id === item.id)
            ? state
            : { products: [...state.products, item] }
        ),
      removeProduct: (productId: string) =>
        set((state) => ({
          products: state.products.filter((item) => item.id !== productId),
        })),
      isProductSaved: (productId: string) => get().products.some((item) => item.id === productId),
      clear: () => set(() => ({ products: [] })),
    }),
    {
      name: 'saved-storage',
    }
  )
)
