import { getAllCoupons } from '@/actions/coupons'
import { useQuery } from '@tanstack/react-query'

function useCoupons() {
  const couponsQuery = useQuery({
    queryKey: ['coupons'],
    queryFn: () => getAllCoupons(),
    staleTime: 1000 * 60 * 60,
  })

  return {
    couponsQuery,
  }
}

export default useCoupons
