import { getAllCategories } from '@/actions/categories'
import { useQuery } from '@tanstack/react-query'

function useCategories() {
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => getAllCategories(),
    staleTime: 1000 * 60 * 60,
  })

  return {
    categoriesQuery,
  }
}

export default useCategories
