import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import useProducts from '@/hooks/products/useProducts'
import ProductItem from '../products/ProductItem'
import ProductSkeleton from '../products/ProductSkeleton'

function FeaturedProducts() {
  const limit = 3
  const { productsQuery } = useProducts({ fetchWithFilters: false })

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container space-y-12 mx-auto">
        {productsQuery.isFetching && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, idx) => (
              <ProductSkeleton key={idx} renderMode="card" />
            ))}
          </div>
        )}
        {productsQuery.isSuccess && productsQuery.data.objects.length && (
          <>
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Productos destacados
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Nuestros productos agrícolas más vendidos esta temporada
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {productsQuery.data.objects.slice(0, limit).map((product, idx) => (
                <div key={product.id} className={idx === 1 ? '-translate-y-4' : ''}>
                  <ProductItem product={product} renderMode="card" />
                </div>
              ))}
            </div>
          </>
        )}
        <div className="flex justify-center">
          <Button asChild variant="outline" className="gap-1">
            <Link to="/products" className="flex items-center">
              <span className="text-sm">Ver todos los productos</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
