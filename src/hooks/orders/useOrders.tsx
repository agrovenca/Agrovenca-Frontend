import { getAllOrders } from '@/actions/orders'
import { useQuery } from '@tanstack/react-query'

function useOrders() {
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: () => getAllOrders(),
    staleTime: 1000 * 60 * 60,
  })

  return {
    ordersQuery,
  }
}

export default useOrders
