import { getProducts } from '@/actions/products'
import { useQuery } from '@tanstack/react-query'

interface Options {
  page?: number
  search?: string
  limit?: number
  categoriesIds?: string[]
  unitiesIds?: string[]
  priceRange?: number[]
  inStockOnly?: boolean
}

function useProducts(options: Options) {
  const productsQuery = useQuery({
    queryKey: ['products', { ...options }],
    queryFn: () => getProducts({ ...options }),
    staleTime: 1000 * 60 * 10,
  })

  return {
    productsQuery,
  }
}

export default useProducts
