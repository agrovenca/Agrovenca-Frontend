import ShippingAddress from '@/pages/checkout/shippingAddress'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ShippingAddressState {
  addresses: ShippingAddress[]
  addAddress: (address: ShippingAddress) => void
  setAddresses: (addresses: ShippingAddress[]) => void
  updateAddress: (updatedAddress: ShippingAddress) => void
  removeAddress: (addressPk: string) => void
  selectedAddress?: ShippingAddress['pk']
  setSelectedAddress: (addressId?: ShippingAddress['pk']) => void
  clearAddresses: () => void
}

export const useShippingAddressStore = create<ShippingAddressState>()(
  persist(
    (set) => ({
      addresses: [],
      addAddress: (address) =>
        set((state) => ({
          addresses: [address, ...state.addresses],
        })),
      setAddresses: (addresses) => set(() => ({ addresses })),
      updateAddress: (updatedAddress) =>
        set((state) => ({
          addresses: state.addresses.map((address) =>
            address.pk === updatedAddress.pk ? updatedAddress : address
          ),
        })),
      removeAddress: (addressPk) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.pk !== addressPk),
        })),
      selectedAddress: undefined,
      setSelectedAddress: (addressId) => set(() => ({ selectedAddress: addressId })),
      clearAddresses: () => set(() => ({ addresses: [] })),
    }),
    {
      name: 'shipping-address-storage',
    }
  )
)
