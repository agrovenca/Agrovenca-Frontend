import { deleteProduct } from '@/actions/products'
import { ProductsPaginatedResponse } from '@/types/product'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProductsQueryKey } from './useProductsQueryKey'

function useDeleteProduct() {
  const filters = useProductsQueryKey()
  const queryClient = useQueryClient()
  const deleteProductMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteProduct({ id }),
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
          objects: oldProducts.objects.filter((product) => product.id !== id),
        }
      })

      return { previousProducts }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData<ProductsPaginatedResponse>(
          ['products', filters],
          context?.previousProducts
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', filters],
      })
    },
  })

  return { deleteProductMutation }
}

export default useDeleteProduct
