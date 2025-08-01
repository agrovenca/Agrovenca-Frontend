import { getOrdersByUser } from '@/actions/orders'
import { useQuery } from '@tanstack/react-query'

function useOrders({ userId }: { userId: string }) {
  const ordersQuery = useQuery({
    queryKey: ['orders', userId],
    queryFn: () => getOrdersByUser({ userId }),
    staleTime: 1000 * 60 * 60,
  })

  return {
    ordersQuery,
  }
}

export default useOrders
