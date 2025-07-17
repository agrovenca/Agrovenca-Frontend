import Navbar from '@/components/pages/HomeNavbar'
import { useProductsStore } from '@/store/products/useProductsStore'
import { useEffect, useState } from 'react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Grid, List, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Pagination from '@/components/blocks/pagination'
import { useAuthStore } from '@/store/auth/useAuthStore'
import Footer from '@/components/pages/Footer'
import useProducts from '@/hooks/products/useProducts'
import ProductItem from './ProductItem'

function ProductsPage() {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const user = useAuthStore((state) => state.user)
  const setUserId = useProductsStore((state) => state.setUserId)

  const { productsQuery, setNextPage, setPrevPage, setPageNumber } = useProducts({ limit: 12 })

  useEffect(() => {
    if (user) setUserId(user.id)
  }, [setUserId, user])

  return (
    <div>
      <Navbar />
      <section className="container mx-auto py-4 px-2">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-2">
            Discover our wide range of fresh agricultural products
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex  gap-4 mb-6 flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filtrar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-6 flex-col sm:flex-row">
          {/* Main Content */}
          <main className="flex-1">
            {/* Products Grid/List */}
            {productsQuery.isPending ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse h-[350px] bg-muted" />
                ))}
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {productsQuery.data?.objects.map((product) => (
                      <ProductItem key={product.id} product={product} renderMode="grid" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {productsQuery.data?.objects.map((product) => (
                      <ProductItem key={product.id} product={product} renderMode="list" />
                    ))}
                  </div>
                )}
                {productsQuery.data?.objects.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No se encontraron productos</p>
                  </div>
                )}
              </>
            )}

            {productsQuery.data && (
              <Pagination
                hasNextPage={productsQuery.data.hasNextPage}
                hasPreviousPage={productsQuery.data.hasPreviousPage}
                currentPage={productsQuery.data.page}
                totalPages={productsQuery.data.totalPages}
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
