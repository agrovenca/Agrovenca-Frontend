import { createOrder } from '@/actions/orders'
import { OrderCreateSchema } from '@/schemas/orders'
import { Order, OrderStatus } from '@/types/order'
import { ShippingAddress } from '@/types/shippingAddress'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

const getOptimisticOrder = (
  newData: z.infer<typeof OrderCreateSchema>,
  userId: string,
  shippingAddress: ShippingAddress | undefined
) => {
  const sharedId = Math.random().toString()
  return {
    ...newData,
    userId,
    shippingId: newData.shippingAddressId,
    couponId: sharedId,
    status: OrderStatus.PENDING,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    items: newData.products.map((product) => ({
      id: sharedId,
      productId: product.id,
      quantity: product.quantity,
      price: product.price.toString(),
      product: { name: product.name, images: [] },
    })),
    shipping: shippingAddress as ShippingAddress,
    // shipping: {
    //   pk: sharedId,
    //   alias: '',
    //   name: '',
    //   lastName: '',
    //   email: '',
    //   phone: '',
    //   address_line_1: '',
    //   country: '',
    //   state: '',
    //   city: '',
    //   isDefault: false,
    //   createdAt: new Date().toISOString(),
    //   userId,
    // },
    coupon: {
      code: newData.couponId || sharedId,
      discount: newData.discount,
    },
    tax: newData.tax.toString(),
    subtotal: newData.subtotal.toString(),
    discount: newData.discount.toString(),
    total: newData.total.toString(),
  }
}

interface Props {
  userId: string
  shippingAddress: ShippingAddress | undefined
}

function useCreateOrder({ userId, shippingAddress }: Props) {
  const queryClient = useQueryClient()

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onMutate: ({ newData }) => {
      const optimisticOrder = getOptimisticOrder(newData, userId, shippingAddress)
      queryClient.setQueryData<Order[]>(['orders', userId], (oldOrders) => {
        if (!oldOrders) return [optimisticOrder]
        return [optimisticOrder, ...oldOrders]
      })

      return { optimisticOrder }
    },
    onSuccess: ({ order: newOrder }, _variables, context) => {
      queryClient.setQueryData<Order[]>(['orders', userId], (oldOrders) => {
        if (!oldOrders) return []
        return oldOrders.map((cachedOrder) =>
          cachedOrder.id === context.optimisticOrder.id ? newOrder : cachedOrder
        )
      })
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData<Order[]>(['orders', userId], (oldOrders) => {
        if (!oldOrders) return []
        return oldOrders.filter((cachedOrder) => cachedOrder.id !== context?.optimisticOrder.id)
      })
    },
  })

  return { createOrderMutation }
}

export default useCreateOrder
