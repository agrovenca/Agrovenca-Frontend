import { createProduct } from '@/actions/products'
import { useProductFiltersStore } from '@/store/products/useProductFiltersStore'
import { ProductsPaginatedResponse } from '@/types/product'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const emptyPagination = {
  page: 1,
  totalItems: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  nextPage: null,
  previousPage: null,
}

function useCreateProduct() {
  const { page, limit, search } = useProductFiltersStore()
  const queryClient = useQueryClient()

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onMutate: ({ newData }) => {
      const previousProducts = queryClient.getQueryData<ProductsPaginatedResponse>([
        'products',
        { page, limit, search },
      ])
      const optimisticProduct = {
        ...newData,
        id: Math.random().toString(),
        slug: newData.name.toLowerCase().replace(/\s+/g, '-'),
        userId: Math.random().toString(),
        images: [],
        displayOrder: previousProducts?.objects.length ?? 0 + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      queryClient.setQueryData<ProductsPaginatedResponse>(
        ['products', { page, limit, search }],
        (oldProducts) => {
          if (!oldProducts || !oldProducts.objects)
            return { objects: [optimisticProduct], pagination: emptyPagination }
          return {
            ...oldProducts,
            objects: [...oldProducts.objects, optimisticProduct],
          }
        }
      )
      return { optimisticProduct }
    },
    onSuccess: ({ product: newProduct }, _variables, context) => {
      queryClient.setQueryData<ProductsPaginatedResponse>(
        ['products', { page, limit, search }],
        (oldProducts) => {
          if (!oldProducts || !oldProducts.objects)
            return {
              pagination: emptyPagination,
              objects: [newProduct],
            }

          return {
            ...oldProducts,
            objects: oldProducts.objects.map((product) =>
              product.id === context?.optimisticProduct.id ? newProduct : product
            ),
          }
        }
      )
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData<ProductsPaginatedResponse>(
        ['products', { page, limit, search }],
        (oldProducts) => {
          if (!oldProducts || !oldProducts.objects)
            return { objects: [], pagination: emptyPagination }
          return {
            ...oldProducts,
            objects: oldProducts.objects.filter(
              (product) => product.id !== context?.optimisticProduct.id
            ),
          }
        }
      )
    },
  })

  return { createProductMutation }
}

export default useCreateProduct
