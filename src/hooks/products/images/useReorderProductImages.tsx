import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProductsQueryKey } from '../useProductsQueryKey'
import { updateProductImagesOrder } from '@/actions/products/images'
import { ProductsPaginatedResponse } from '@/types/product'

interface Payload {
  id: string
  displayOrder: number
}

function useReorderProductImages() {
  const filters = useProductsQueryKey()
  const queryClient = useQueryClient()
  const reorderImagesMutation = useMutation({
    mutationFn: ({ productId, payload }: { productId: string; payload: Payload[] }) =>
      updateProductImagesOrder(productId, payload),

    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({
        queryKey: ['products', filters],
      })

      const previousData = queryClient.getQueryData<ProductsPaginatedResponse>([
        'products',
        filters,
      ])

      queryClient.setQueryData(['products', filters], (oldData: ProductsPaginatedResponse) => {
        if (!oldData || !oldData.objects.length) return oldData
        return {
          ...oldData,
          objects: oldData.objects.map((oldProduct) => {
            if (oldProduct.id === newOrder.productId) {
              return {
                ...oldProduct,
                images: oldProduct.images.map((img) => {
                  const match = newOrder.payload.find((p) => p.id === img.id)
                  return match ? { ...img, displayOrder: match.displayOrder } : img
                }),
              }
            }
            return oldProduct
          }),
        }
      })
      return { previousData }
    },
    onError: (_err, _newOrder, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['products', filters], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products', filters] })
    },
  })

  return { reorderImagesMutation }
}

export default useReorderProductImages
