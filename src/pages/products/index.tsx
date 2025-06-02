import { getProducts } from '@/actions/products'
import Navbar from '@/components/pages/HomeNavbar'
import { useProductsStore } from '@/store/products/useProductsStore'
import { usePaginationStore } from '@/store/shared/usePaginationStore'
import { Product, ProductFilterParams } from '@/types/product'
import { useCallback, useEffect, useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Filter, Grid, Heart, List, Search, ShoppingCart } from 'lucide-react'
import ProductImagePlaceholder from '@/assets/images/productImagePlaceholder.png'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
// import { useUnitiesStore } from '@/store/unities/useUnitiesStore'
// import { useCategoriesStore } from '@/store/categories/useCategoriesStore'

function ProductCard({ product }: { product: Product }) {
  const inStock = product.stock > 0
  const productPrice = Number(product.price)
  const productSecondPrice = Number(product.secondPrice ?? 0)
  const firstProductImage = product.images.find((image) => image.displayOrder === 1)?.s3Key

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg pt-0">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images.length > 0 ? firstProductImage : ProductImagePlaceholder}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="h-8 w-8 cursor-pointer">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {productSecondPrice && productSecondPrice > 0 ? (
                <>
                  <span className="text-lg font-bold">${productSecondPrice.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${productPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold">${productPrice.toFixed(2)}</span>
              )}
            </div>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
              disabled={!inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductListItem({ product }: { product: Product }) {
  const inStock = product.stock > 0
  const productPrice = Number(product.price)
  const productSecondPrice = Number(product.secondPrice ?? 0)
  const firstProductImage = product.images.find((image) => image.displayOrder === 1)?.s3Key

  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="p-0">
        <div className="flex gap-2">
          <div className="relative w-48 h-48 shrink-0">
            <img
              src={product.images.length > 0 ? firstProductImage : ProductImagePlaceholder}
              alt={product.name}
              className="max-w-[200px] object-cover"
            />
            {!inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary">Out of Stock</Badge>
              </div>
            )}
          </div>

          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                <Badge variant="outline" className="mb-2">
                  category
                </Badge>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">{product.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {productSecondPrice && productSecondPrice > 0 ? (
                  <>
                    <span className="text-lg font-bold">${productSecondPrice.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      ${productPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold">${productPrice.toFixed(2)}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="cursor-pointer">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 cursor-pointer"
                  disabled={!inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductsPage() {
  const [search, setSearch] = useState('')
  // const [limit, setLimit] = useState(10)
  // const [categoryId, setCategoryId] = useState('')
  // const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const products = useProductsStore((state) => state.products)
  const setProducts = useProductsStore((state) => state.setProducts)
  // const setUnities = useUnitiesStore((state) => state.setUnities)
  // const setCategories = useCategoriesStore((state) => state.setCategories)
  // const paginationData = usePaginationStore((state) => state.paginationData)
  const setPaginationData = usePaginationStore((state) => state.setPaginationData)

  const fetchData = useCallback(
    async (params?: ProductFilterParams) => {
      // setIsLoading(true)
      try {
        const { data } = await getProducts(params)
        setProducts(data.objects)
        setPaginationData({ ...data })
      } catch (error) {
        console.error('Error al obtener productos', error)
      } finally {
        // setIsLoading(false)
      }
    },
    [setProducts, setPaginationData]
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div>
      <Navbar />
      <section className="container mx-auto py-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-2">
            Discover our wide range of fresh agricultural products
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Filter products by category, price, and availability
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">{/* <FilterSidebar /> */}</div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-4">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

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

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">Filters</h2>
                {/* <FilterSidebar /> */}
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Products Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}
            {/* No Results */}
            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
                <Button variant="outline" className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  )
}

export default ProductsPage
