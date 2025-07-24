import { getProducts } from '@/actions/products'
import { useQuery } from '@tanstack/react-query'
import { useProductsFilterSetters, useProductsQueryKey } from './useProductsQueryKey'

interface Options {
  inStockOnly?: boolean
  enabled?: boolean
  fetchWithFilters?: boolean
}

function useProducts({ enabled = true, fetchWithFilters = true }: Options) {
  const filters = useProductsQueryKey()
  const { setPage } = useProductsFilterSetters()
  const initialQueryKey = ['products', filters]

  if (!fetchWithFilters) {
    initialQueryKey.pop()
  }

  const productsQuery = useQuery({
    queryKey: initialQueryKey,
    queryFn: () => getProducts(fetchWithFilters ? filters : {}),
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
