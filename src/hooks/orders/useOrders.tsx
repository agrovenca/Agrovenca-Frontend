import { getAllOrders } from '@/actions/orders'
import { useQuery } from '@tanstack/react-query'
import { useOrdersFilterSetters, useOrdersQueryKey } from './useOrderQueryKey'

function useOrders() {
  const filters = useOrdersQueryKey()
  const { setPage } = useOrdersFilterSetters()

  const ordersQuery = useQuery({
    queryKey: ['orders', filters],
    queryFn: () => getAllOrders(filters),
    staleTime: 1000 * 60 * 60,
  })

  const setPrevPage = () => {
    if (filters.page === 1) return

    setPage(Number(ordersQuery.data?.pagination.previousPage))
  }

  const setNextPage = () => {
    if (!ordersQuery.data?.pagination.hasNextPage) return

    setPage(Number(ordersQuery.data?.pagination.nextPage))
  }

  const setPageNumber = (page: number) => {
    setPage(page)
  }

  return {
    ordersQuery,
    page: filters.page,
    setPrevPage,
    setNextPage,
    setPageNumber,
  }
}

export default useOrders
