import { getShippingAddresses } from '@/actions/shippingData'
import { useQuery } from '@tanstack/react-query'

interface Props {
  userId: string
}

function useShippingAddresses({ userId }: Props) {
  const shippingAddressesQuery = useQuery({
    queryKey: ['shippingAddresses', userId],
    queryFn: () => getShippingAddresses({ userId }),
    staleTime: 1000 * 60 * 60,
  })
  return { shippingAddressesQuery }
}

export default useShippingAddresses
