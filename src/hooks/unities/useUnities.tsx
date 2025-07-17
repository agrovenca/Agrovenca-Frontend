import { getAllUnities } from '@/actions/unities'
import { useQuery } from '@tanstack/react-query'

function useUnities() {
  const unitiesQuery = useQuery({
    queryKey: ['unities'],
    queryFn: () => getAllUnities(),
    staleTime: 1000 * 60 * 60,
  })

  return {
    unitiesQuery,
  }
}

export default useUnities
