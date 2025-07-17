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
}

function useProducts({ limit }: Options) {
  const [page, setPage] = useState(1)

  const productsQuery = useQuery({
    queryKey: ['products', { page, limit }],
    queryFn: () => getProducts({ page, limit }),
    staleTime: 1000 * 60 * 10,
  })

  const setPrevPage = () => {
    if (page === 1) return

    setPage(Number(productsQuery.data?.previousPage))
  }

  const setNextPage = () => {
    if (!productsQuery.data?.hasNextPage) return

    setPage(Number(productsQuery.data?.nextPage))
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
