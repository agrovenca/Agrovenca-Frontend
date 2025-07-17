import { getProduct } from '@/actions/products'
import { useQuery } from '@tanstack/react-query'

interface Options {
  slug: string
}

function useProduct({ slug }: Options) {
  const productQuery = useQuery({
    queryKey: ['products', { slug }],
    queryFn: () => getProduct({ slug }),
    staleTime: 1000 * 60 * 60,
  })

  return {
    productQuery,
  }
}

export default useProduct
