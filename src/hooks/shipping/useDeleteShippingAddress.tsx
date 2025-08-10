import { deleteAddress } from '@/actions/shippingData'
import { ShippingAddress } from '@/types/shippingAddress'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function useDeleteShippingAddress({ userId }: { userId: string }) {
  const queryClient = useQueryClient()
  const deleteAddressMutation = useMutation({
    mutationFn: ({ pk }: { pk: string }) => deleteAddress({ pk }),
    onMutate: async ({ pk }) => {
      await queryClient.cancelQueries({ queryKey: ['shippingAddresses', userId] })
      const previousAddresses = queryClient.getQueryData<ShippingAddress[]>([
        'shippingAddresses',
        userId,
      ])

      queryClient.setQueryData<ShippingAddress[]>(['shippingAddresses', userId], (oldAddresses) => {
        if (!oldAddresses) return []
        return oldAddresses.filter((address) => address.pk !== pk)
      })

      return { previousAddresses }
    },
    onError: (_error, _variables, context) => {
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

  return { deleteAddressMutation }
}

export default useDeleteShippingAddress
