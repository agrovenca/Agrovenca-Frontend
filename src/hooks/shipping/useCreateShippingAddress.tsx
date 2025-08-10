import { createAddress } from '@/actions/shippingData'
import { ShippingAddress } from '@/types/shippingAddress'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Props {
  userId: string
}

function useCreateShippingAddress({ userId }: Props) {
  const queryClient = useQueryClient()

  const createShippingAddressMutation = useMutation({
    mutationFn: createAddress,
    onMutate: ({ newData }) => {
      const optimisticAddress = {
        ...newData,
        pk: Math.random().toString(),
        isDefault: false,
        createdAt: new Date().toISOString(),
        userId,
      }
      queryClient.setQueryData<ShippingAddress[]>(['shippingAddresses', userId], (oldAddresses) => {
        if (!oldAddresses) return [optimisticAddress]
        return [optimisticAddress, ...oldAddresses]
      })
      return { optimisticAddress }
    },
    onSuccess: ({ address: newAddress }, _variables, context) => {
      queryClient.setQueryData<ShippingAddress[]>(['shippingAddresses', userId], (oldAddresses) => {
        if (!oldAddresses) return [newAddress]

        return oldAddresses.map((cachedAddress) =>
          cachedAddress.pk === context.optimisticAddress.pk ? newAddress : cachedAddress
        )
      })
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData<ShippingAddress[]>(['shippingAddresses', userId], (oldAddresses) => {
        if (!oldAddresses) return []
        return oldAddresses.filter((address) => address.pk !== context?.optimisticAddress.pk)
      })
    },
  })

  return { createShippingAddressMutation }
}

export default useCreateShippingAddress
