import { create } from 'zustand'
import { Product } from '@/types/product'

interface ProductsState {
  products: Product[]
  setProducts: (products: Product[] | ((products: Product[]) => Product[])) => void
  updateProduct: (updatedProduct: Product) => void
  deleteProduct: (id: string) => void
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  setProducts: (updater) => {
    set((state) => ({
      products: typeof updater === 'function' ? updater(state.products) : updater,
    }))
  },
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
}))
