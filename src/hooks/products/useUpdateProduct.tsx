import { updateProduct } from '@/actions/products'
import { ProductUpdateSchema } from '@/schemas/products'
import { useProductFiltersStore } from '@/store/products/useProductFiltersStore'
import { ProductsPaginatedResponse } from '@/types/product'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

interface Props {
  id: string
  newData: z.infer<typeof ProductUpdateSchema>
}

function useUpdateProduct() {
  const { page, limit, search, categoriesId, unitiesId } = useProductFiltersStore()
  const queryClient = useQueryClient()
  const updateProductMutation = useMutation({
    mutationFn: ({ id, newData }: Props) => updateProduct({ id, newData }),
    onMutate: async ({ id, newData }) => {
      await queryClient.cancelQueries({
        queryKey: ['products', { page, limit, search, categoriesId, unitiesId }],
      })

      const previousProducts = queryClient.getQueryData<ProductsPaginatedResponse>([
        'products',
        { page, limit, search, categoriesId, unitiesId },
      ])

      queryClient.setQueryData<ProductsPaginatedResponse>(
        ['products', { page, limit, search, categoriesId, unitiesId }],
        (oldProducts) => {
          if (!oldProducts || !oldProducts.objects) return oldProducts
          return {
            ...oldProducts,
            objects: oldProducts.objects.map((product) =>
              product.id === id ? { ...product, ...newData } : product
            ),
          }
        }
      )
      return { previousProducts }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(
          ['products', { page, limit, search, categoriesId, unitiesId }],
          context.previousProducts
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', { page, limit, search, categoriesId, unitiesId }],
      })
    },
  })

  return { updateProductMutation }
}

export default useUpdateProduct
