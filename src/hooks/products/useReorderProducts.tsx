import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProductOrder, updateProductsOrder } from '@/actions/products'
import { ProductResponse, ProductsPaginatedResponse } from '@/types/product'
import { useProductsQueryKey } from './useProductsQueryKey'

interface Payload {
  id: string
  displayOrder: number
}

export function useReorderProducts() {
  const filters = useProductsQueryKey()
  const queryClient = useQueryClient()
  const reorderMutation = useMutation({
    mutationFn: (payload: Payload[]) => updateProductsOrder(payload),

    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({
        queryKey: ['products', filters],
      })

      const previousData = queryClient.getQueryData<ProductResponse>(['products', filters])

      queryClient.setQueryData(['products', filters], (old: ProductsPaginatedResponse) => {
        if (!old) return old
        return {
          ...old,
          objects: newOrder.map((order) => ({
            ...old.objects.find((p) => p.id === order.id),
            displayOrder: order.displayOrder,
          })),
        }
      })

      return { previousData }
    },
    onError: (_error, _newOrder, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['products', filters], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', filters],
      })
    },
  })

  return { reorderMutation }
}

export function useReorderProduct() {
  const filters = useProductsQueryKey()
  const queryClient = useQueryClient()

  const reorderSingleMutation = useMutation({
    mutationFn: (payload: Payload) => updateProductOrder(payload),

    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({
        queryKey: ['products', filters],
      })

      const previousData = queryClient.getQueryData<ProductsPaginatedResponse>([
        'products',
        filters,
      ])

      queryClient.setQueryData(['products', filters], (old: ProductsPaginatedResponse) => {
        if (!old) return old

        const updatedObjects = old.objects.map((p) => {
          if (p.id === newOrder.id) {
            return { ...p, displayOrder: newOrder.displayOrder }
          }
          return p
        })

        return {
          ...old,
          objects: updatedObjects,
        }
      })

      return { previousData }
    },
    onError: (_error, _newOrder, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['products', filters], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return { reorderSingleMutation }
}
