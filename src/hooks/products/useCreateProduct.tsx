import { createProduct } from '@/actions/products'
import { Product } from '@/types/product'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function useCreateProduct() {
  const queryClient = useQueryClient()

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onMutate: ({ newData }) => {
      const optimisticProduct = {
        ...newData,
        id: Math.random().toString(),
        slug: newData.name.toLowerCase().replace(/\s+/g, '-'),
        userId: Math.random().toString(),
        images: [],
        displayOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      queryClient.setQueryData<Product[]>(
        ['product', { page: 1, limit: 12, search: '' }],
        (oldProducts) => {
          if (!oldProducts) return [optimisticProduct]
          return [optimisticProduct, ...oldProducts]
        }
      )
      return { optimisticProduct }
    },
    onSuccess: ({ product: newProduct }, _variables, context) => {
      queryClient.setQueryData<Product[]>(
        ['product', { page: 1, limit: 12, search: '' }],
        (oldProducts) => {
          if (!oldProducts) return [newProduct]

          return oldProducts.map((cachedProduct) =>
            cachedProduct.id === context.optimisticProduct.id ? newProduct : cachedProduct
          )
        }
      )
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData<Product[]>(
        ['product', { page: 1, limit: 12, search: '' }],
        (oldProducts) => {
          if (!oldProducts) return []
          return oldProducts.filter((product) => product.id !== context?.optimisticProduct.id)
        }
      )
    },
  })

  return { createProductMutation }
}

export default useCreateProduct
