import { deleteProduct } from '@/actions/products'
import { useProductFiltersStore } from '@/store/products/useProductFiltersStore'
import { ProductsPaginatedResponse } from '@/types/product'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function useDeleteProduct() {
  const { page, limit, search } = useProductFiltersStore()
  const queryClient = useQueryClient()
  const deleteProductMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteProduct({ id }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['products', { page, limit, search }] })
      const previousProducts = queryClient.getQueryData<ProductsPaginatedResponse>([
        'products',
        { page, limit, search },
      ])

      queryClient.setQueryData<ProductsPaginatedResponse>(
        ['products', { page, limit, search }],
        (oldProducts) => {
          if (!oldProducts || !oldProducts.objects) return oldProducts
          return {
            ...oldProducts,
            objects: oldProducts.objects.filter((product) => product.id !== id),
          }
        }
      )

      return { previousProducts }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData<ProductsPaginatedResponse>(
          ['products', { page, limit, search }],
          context?.previousProducts
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products', { page, limit, search }] })
    },
  })

  return { deleteProductMutation }
}

export default useDeleteProduct
