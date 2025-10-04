import { registerPayment } from '@/actions/orders'
import { Order, OrderPayment, PaymentStatus } from '@/types/order'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Props {
  order: Order
  userId: string
}

function useCreatePayment({ order, userId }: Props) {
  const queryClient = useQueryClient()

  const createPaymentMutation = useMutation({
    mutationFn: registerPayment,
    onMutate: ({ newData }) => {
      const previousOrders = queryClient.getQueryData<Order[]>(['orders', userId])
      const optimisticPayment: OrderPayment = {
        id: `temp-${crypto.randomUUID()}`,
        orderId: order.id,
        status: PaymentStatus.UNPAID,
        receipt: URL.createObjectURL(newData.receipt),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const optimisticOrder: Order = {
        ...order,
        payment: optimisticPayment,
      }

      queryClient.setQueryData<Order[]>(['orders', userId], (oldOrders) => {
        if (!oldOrders) return [optimisticOrder]
        return oldOrders.map((cachedOrder) =>
          cachedOrder.id === order.id ? optimisticOrder : cachedOrder
        )
      })

      return { previousOrders, optimisticOrder }
    },
    onSuccess: ({ payment: newPayment }, _variables, { optimisticOrder }) => {
      queryClient.setQueryData<Order[]>(['orders', userId], (oldOrders) => {
        if (!oldOrders) return [optimisticOrder]
        return oldOrders.map((cachedOrder) =>
          cachedOrder.id === optimisticOrder.id ? { ...order, payment: newPayment } : cachedOrder
        )
      })
    },
    onError: (_error, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData<Order[]>(['orders', userId], context.previousOrders)
      }
    },
  })

  return { createPaymentMutation }
}

export default useCreatePayment
