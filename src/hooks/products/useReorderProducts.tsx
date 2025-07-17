import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProductOrder } from '@/actions/products' // esta sería tu función de API
import { toast } from 'sonner'
import { ProductResponse } from '@/types/product'

interface Payload {
  id: string
  displayOrder: number
}

function useReorderProducts({ page }: { page: number }) {
  const queryClient = useQueryClient()
  const reorderMutation = useMutation({
    mutationFn: (payload: Payload[]) => updateProductOrder(payload),

    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({
        queryKey: ['products', { page }],
      })

      const previousData = queryClient.getQueryData<ProductResponse>(['products'])

      queryClient.setQueryData(['products'], (old: ProductResponse | undefined) => {
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

    onError: (_err, _newOrder, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['products'], context.previousData)
      }
      toast.error('Error al actualizar el orden de los productos')
    },

    onSuccess: () => {
      toast.success('Orden actualizado correctamente')
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', { page }],
      })
    },
  })

  return { reorderMutation }
}

export default useReorderProducts
