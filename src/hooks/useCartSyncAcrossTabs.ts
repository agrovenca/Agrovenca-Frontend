import { useCartStore } from '@/store/cart/useCartStore'
import { useEffect } from 'react'

export function useCartSyncAcrossTabs() {
  const setItems = useCartStore.setState

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cart-storage' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (parsed?.state?.items) {
            setItems({ items: parsed.state.items })
          }
        } catch (error) {
          console.error('Error parsing cart-storage from localStorage:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [setItems])
}
