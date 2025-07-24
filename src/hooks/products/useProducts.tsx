import { getProducts } from '@/actions/products'
import { useQuery } from '@tanstack/react-query'
import { useProductsFilterSetters, useProductsQueryKey } from './useProductsQueryKey'
import { ProductFilterParams } from '@/types/product'

interface Options {
  priceRange?: number[]
  inStockOnly?: boolean
  enabled?: boolean
}

function useProducts({ enabled = true }: Options) {
  const filters = useProductsQueryKey()
  const { setPage } = useProductsFilterSetters()

  const productsQuery = useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters as ProductFilterParams),
    staleTime: 1000 * 60 * 10,
    enabled,
  })

  const setPrevPage = () => {
    if (filters.page === 1) return

    setPage(Number(productsQuery.data?.pagination.previousPage))
  }

  const setNextPage = () => {
    if (!productsQuery.data?.pagination.hasNextPage) return

    setPage(Number(productsQuery.data?.pagination.nextPage))
  }

  const setPageNumber = (page: number) => {
    setPage(page)
  }

  return {
    productsQuery,
    page: filters.page,
    setPrevPage,
    setNextPage,
    setPageNumber,
  }
}

export default useProducts
