import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types/cart'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateItem: (updatedItem: CartItem) => void
  deleteItem: (productId: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      updateItem: (updatedItem) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === updatedItem.productId ? updatedItem : item
          ),
        })),
      deleteItem: (productId: string) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      clearCart: () => set(() => ({ items: [] })),
    }),
    {
      name: 'cart-storage', // clave en localStorage
    }
  )
)
