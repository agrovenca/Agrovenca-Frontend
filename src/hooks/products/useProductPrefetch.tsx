import { getProduct } from '@/actions/products'
import { useQueryClient } from '@tanstack/react-query'

function useProductPrefetch() {
  const queryClient = useQueryClient()
  const prefetch = async ({ slug }: { slug: string }) => {
    await queryClient.prefetchQuery({
      queryKey: ['products', { slug }],
      queryFn: () => getProduct({ slug }),
      staleTime: 1000 * 60 * 60,
    })
  }

  return { prefetch }
}

export default useProductPrefetch
