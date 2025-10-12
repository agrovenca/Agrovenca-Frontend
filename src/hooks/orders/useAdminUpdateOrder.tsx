import { updateAdminOrder } from '@/actions/orders'
import { OrderAdminUpdateSchema } from '@/schemas/orders'
import { Order } from '@/types/order'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

function useUpdateAdminOrder() {
  const queryClient = useQueryClient()
  const updateAdminOrderMutation = useMutation({
    mutationFn: ({
      id,
      newData,
    }: {
      id: string
      newData: z.infer<typeof OrderAdminUpdateSchema>
    }) => updateAdminOrder({ id, newData }),
    onMutate: async ({ id, newData }) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] })

      const previousOrders = queryClient.getQueryData<Order[]>(['orders'])

      queryClient.setQueryData<Order[]>(['orders'], (oldOrders) => {
        if (!oldOrders) return []

        return oldOrders.map((order) => (order.id === id ? { ...order, ...newData } : order))
      })
      return { previousOrders }
    },
    onError: (_, __, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  return { updateAdminOrderMutation }
}

export default useUpdateAdminOrder
