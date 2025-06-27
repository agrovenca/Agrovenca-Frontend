import ShippingAddress from '@/pages/checkout/shippingAddress'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ShippingAddressState {
  addresses: ShippingAddress[]
  addAddress: (address: ShippingAddress) => void
  setAddresses: (addresses: ShippingAddress[]) => void
  updateAddress: (updatedAddress: ShippingAddress) => void
  removeAddress: (address: ShippingAddress) => void
  clearAddresses: () => void
}

export const useShippingAddressStore = create<ShippingAddressState>()(
  persist(
    (set) => ({
      addresses: [],
      addAddress: (address) =>
        set((state) => ({
          addresses: [...state.addresses, address],
        })),
      setAddresses: (addresses) => set(() => ({ addresses })),
      updateAddress: (updatedAddress) =>
        set((state) => ({
          addresses: state.addresses.map((address) =>
            address.pk === updatedAddress.pk ? updatedAddress : address
          ),
        })),
      removeAddress: (address) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.pk !== address.pk),
        })),
      clearAddresses: () => set(() => ({ addresses: [] })),
    }),
    {
      name: 'shipping-address-storage',
    }
  )
)
