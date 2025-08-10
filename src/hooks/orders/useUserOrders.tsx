import { getOrdersByUser } from '@/actions/orders'
import { useQuery } from '@tanstack/react-query'

function useUserOrders({ userId }: { userId: string }) {
  const useOrdersQuery = useQuery({
    queryKey: ['orders', userId],
    queryFn: () => getOrdersByUser({ userId }),
    staleTime: 1000 * 60 * 60,
  })

  return {
    useOrdersQuery,
  }
}

export default useUserOrders
