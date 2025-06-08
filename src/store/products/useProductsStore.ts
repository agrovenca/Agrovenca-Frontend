import { create } from 'zustand'
import { Product } from '@/types/product'
import { persist } from 'zustand/middleware'

interface ProductsState {
  products: Product[]
  userId: string | null
  setUserId: (userId: string | null) => void
  setProducts: (products: Product[] | ((products: Product[]) => Product[])) => void
  addProduct: (product: Product) => void
  updateProduct: (updatedProduct: Product) => void
  deleteProduct: (id: string) => void
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      userId: null,
      products: [],
      setUserId: (userId) => {
        if (get().userId !== userId) {
          set({ userId, products: [] }) // limpia productos al cambiar el usuario
        }
      },
      setProducts: (updater) => {
        set((state) => ({
          products: typeof updater === 'function' ? updater(state.products) : updater,
        }))
      },
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),
      updateProduct: (updatedProduct) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          ),
        })),
      deleteProduct: (id: string) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
    }),
    {
      name: `products-store`,
      partialize: (state) => ({
        products: state.products,
        userId: state.userId,
      }),
    }
  )
)
