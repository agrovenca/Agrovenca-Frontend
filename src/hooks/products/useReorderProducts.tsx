import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProductOrder } from '@/actions/products' // esta sería tu función de API
import { toast } from 'sonner'
import { ProductResponse, ProductsPaginatedResponse } from '@/types/product'
import { useProductFiltersStore } from '@/store/products/useProductFiltersStore'

interface Payload {
  id: string
  displayOrder: number
}

function useReorderProducts() {
  const { page, limit, search } = useProductFiltersStore()
  const queryClient = useQueryClient()
  const reorderMutation = useMutation({
    mutationFn: (payload: Payload[]) => updateProductOrder(payload),

    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({
        queryKey: ['products', { page, limit, search }],
      })

      const previousData = queryClient.getQueryData<ProductResponse>([
        'products',
        { page, limit, search },
      ])

      queryClient.setQueryData(
        ['products', { page, limit, search }],
        (old: ProductsPaginatedResponse) => {
          if (!old) return old
          return {
            ...old,
            objects: newOrder.map((order) => ({
              ...old.objects.find((p) => p.id === order.id),
              displayOrder: order.displayOrder,
            })),
          }
        }
      )

      return { previousData }
    },
    onError: (_error, _newOrder, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['products', { page, limit, search }], context.previousData)
      }
      toast.error('Error al actualizar el orden de los productos')
    },

    onSuccess: () => {
      toast.success('Orden actualizado correctamente')
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', { page, limit, search }],
      })
    },
  })

  return { reorderMutation }
}

export default useReorderProducts
