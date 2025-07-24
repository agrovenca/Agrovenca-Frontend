import { updateProduct } from '@/actions/products'
import { ProductUpdateSchema } from '@/schemas/products'
import { ProductsPaginatedResponse } from '@/types/product'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useProductsQueryKey } from './useProductsQueryKey'

interface Props {
  id: string
  newData: z.infer<typeof ProductUpdateSchema>
}

function useUpdateProduct() {
  const filters = useProductsQueryKey()
  const queryClient = useQueryClient()
  const updateProductMutation = useMutation({
    mutationFn: ({ id, newData }: Props) => updateProduct({ id, newData }),
    onMutate: async ({ id, newData }) => {
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
          objects: oldProducts.objects.map((product) =>
            product.id === id ? { ...product, ...newData } : product
          ),
        }
      })
      return { previousProducts }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products', filters], context.previousProducts)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', filters],
      })
    },
  })

  return { updateProductMutation }
}

export default useUpdateProduct
