import { getProducts } from '@/actions/products'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

interface Options {
  search?: string
  limit?: number
  categoriesIds?: string[]
  unitiesIds?: string[]
  priceRange?: number[]
  inStockOnly?: boolean
  enabled?: boolean
}

function useProducts({ search, limit, enabled = true }: Options) {
  const [page, setPage] = useState(1)

  const productsQuery = useQuery({
    queryKey: ['products', { page, limit, search }],
    queryFn: () => getProducts({ page, limit, search }),
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
