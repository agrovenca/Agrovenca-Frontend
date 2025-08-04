import Navbar from '@/components/pages/HomeNavbar'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Grid, List } from 'lucide-react'
import Pagination from '@/components/blocks/pagination'
import Footer from '@/components/pages/Footer'
import useProducts from '@/hooks/products/useProducts'
import ProductItem from './ProductItem'

import ProductSkeleton from './ProductSkeleton'
import ExtendedTooltip from '@/components/blocks/ExtendedTooltip'
import Filters from '@/components/pages/products/Filters'
import { useIsMobile } from '@/hooks/use-mobile'

function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const isMobile = useIsMobile()
  const { productsQuery, setNextPage, setPrevPage, setPageNumber } = useProducts({})

  useEffect(() => {
    if (isMobile) {
      setViewMode('grid')
    }
  }, [isMobile])

  return (
    <div>
      <Navbar />
      <section className="container mx-auto py-4 px-2 md:px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-2">
            Discover our wide range of fresh agricultural products
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex gap-4 mb-6 flex-row md:items-center md:justify-between">
          <Filters />

          <div className="items-center gap-4 hidden md:flex">
            <div className="flex border rounded-md">
              <ExtendedTooltip content={'Ver tarjetas'}>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </ExtendedTooltip>
              <ExtendedTooltip content={'Ver items'}>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </ExtendedTooltip>
            </div>
          </div>
        </div>

        <div className="flex gap-6 flex-col sm:flex-row">
          {/* Main Content */}
          <main className="flex-1 mx-auto">
            <div className="space-y-4"></div>
            {/* Products Grid/List */}
            {productsQuery.isFetching ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, idx) => (
                  <ProductSkeleton key={idx} />
                ))}
              </div>
            ) : productsQuery.isSuccess && productsQuery.data.objects.length ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {productsQuery.data.objects.map((product) => (
                    <ProductItem key={product.id} product={product} renderMode="card" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {productsQuery.data.objects.map((product) => (
                    <ProductItem key={product.id} product={product} renderMode="listItem" />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron productos</p>
              </div>
            )}

            {productsQuery.isSuccess && productsQuery.data && (
              <Pagination
                paginationData={productsQuery.data.pagination}
                currentItems={productsQuery.data.objects.length}
                setNextPage={setNextPage}
                setPrevPage={setPrevPage}
                setPageNumber={setPageNumber}
              />
            )}
          </main>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default ProductsPage
