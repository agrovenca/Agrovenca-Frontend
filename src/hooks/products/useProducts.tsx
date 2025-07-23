import { getProducts } from '@/actions/products'
import { useProductFiltersStore } from '@/store/products/useProductFiltersStore'
import { useQuery } from '@tanstack/react-query'

interface Options {
  unitiesIds?: string[]
  priceRange?: number[]
  inStockOnly?: boolean
  enabled?: boolean
}

function useProducts({ enabled = true }: Options) {
  const { search, page, setPage, limit, categoriesId } = useProductFiltersStore()

  const productsQuery = useQuery({
    queryKey: ['products', { page, limit, search, categoriesId }],
    queryFn: () => getProducts({ page, limit, search, categoriesId }),
    staleTime: 1000 * 60 * 10,
    enabled,
  })

  const setPrevPage = () => {
    if (page === 1) return

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
    page,
    setPrevPage,
    setNextPage,
    setPageNumber,
  }
}

export default useProducts
