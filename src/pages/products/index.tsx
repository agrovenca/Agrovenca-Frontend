import Navbar from '@/components/pages/HomeNavbar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Grid, List, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Pagination from '@/components/blocks/pagination'
import Footer from '@/components/pages/Footer'
import useProducts from '@/hooks/products/useProducts'
import ProductItem from './ProductItem'

import { useDebounce } from 'use-debounce'
import ProductSkeleton from './ProductSkeleton'
import ExtendedTooltip from '@/components/blocks/ExtendedTooltip'
import { useProductFiltersStore } from '@/store/products/useProductFiltersStore'
import { limitOptions } from '@/lib/productLimitOptions'

function ProductsPage() {
  const { limit, setLimit, search, setSearch } = useProductFiltersStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [debouncedSearch] = useDebounce(search, 500)

  const { productsQuery, setNextPage, setPrevPage, setPageNumber } = useProducts({
    search: debouncedSearch,
  })

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
          <div className="flex-1 flex gap-2">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filtrar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select
                defaultValue={limit.toString()}
                onValueChange={(value) => setLimit(Number(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Mostrar" />
                </SelectTrigger>
                <SelectContent>
                  {limitOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      Mostrar {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
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
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, idx) => (
                    <ProductSkeleton key={idx} renderMode="card" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {[...Array(8)].map((_, idx) => (
                    <ProductSkeleton key={idx} renderMode="listItem" />
                  ))}
                </div>
              )
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
