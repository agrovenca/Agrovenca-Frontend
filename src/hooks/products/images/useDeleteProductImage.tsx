import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProductsQueryKey } from '../useProductsQueryKey'
import { deleteProductImage } from '@/actions/products/images'
import { ProductsPaginatedResponse } from '@/types/product'

function useDeleteProductImage() {
  const filters = useProductsQueryKey()
  const queryClient = useQueryClient()
  const deleteProductImageMutation = useMutation({
    mutationFn: deleteProductImage,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: ['products', filters],
      })
      const previousProducts = queryClient.getQueryData<ProductsPaginatedResponse>([
        'products',
        filters,
      ])

      queryClient.setQueryData<ProductsPaginatedResponse>(['products', filters], (oldProducts) => {
        if (!oldProducts || !oldProducts.objects) return oldProducts

        return {
          ...oldProducts,
          objects: oldProducts.objects.map((product) => {
            if (!product.images.some((image) => image.id === id)) return product
            return {
              ...product,
              images: product.images.filter((image) => image.id !== id),
            }
          }),
        }
      })

      return { previousProducts }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData<ProductsPaginatedResponse>(
          ['products', filters],
          context.previousProducts
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', filters],
      })
    },
  })

  return { deleteProductImageMutation }
}

export default useDeleteProductImage
