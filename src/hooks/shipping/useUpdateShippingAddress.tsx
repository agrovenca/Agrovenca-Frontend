import { updateAddress } from '@/actions/shippingData'
import { AddressUpdateSchema } from '@/schemas/products/shippingAddress'
import { ShippingAddress } from '@/types/shippingAddress'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

function useUpdateShippingAddress({ userId }: { userId: string }) {
  const queryClient = useQueryClient()
  const updateShippingAddressMutation = useMutation({
    mutationFn: ({ pk, newData }: { pk: string; newData: z.infer<typeof AddressUpdateSchema> }) =>
      updateAddress({ pk, newData }),
    onMutate: async ({ pk, newData }) => {
      await queryClient.cancelQueries({ queryKey: ['shippingAddresses', userId] })

      const previousAddresses = queryClient.getQueryData<ShippingAddress[]>([
        'shippingAddresses',
        userId,
      ])

      queryClient.setQueryData<ShippingAddress[]>(['shippingAddresses', userId], (oldAddresses) => {
        if (!oldAddresses) return []
        return oldAddresses.map((address) =>
          address.pk === pk ? { ...address, ...newData } : address
        )
      })
      return { previousAddresses }
    },
    onError: (_, __, context) => {
      if (context?.previousAddresses) {
        queryClient.setQueryData<ShippingAddress[]>(
          ['shippingAddresses', userId],
          context.previousAddresses
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['shippingAddresses', userId] })
    },
  })

  return { updateShippingAddressMutation }
}

export default useUpdateShippingAddress
