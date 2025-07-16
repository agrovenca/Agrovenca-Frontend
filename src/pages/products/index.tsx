import Navbar from '@/components/pages/HomeNavbar'
import { useProductsStore } from '@/store/products/useProductsStore'
import { Product } from '@/types/product'
import { memo, useEffect, useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Grid, HeartIcon, HeartOffIcon, List, Search, XIcon } from 'lucide-react'
import ProductImagePlaceholder from '@/assets/images/productImagePlaceholder.png'
import { Input } from '@/components/ui/input'
import { FiltersBar } from '../dashboard/products/Filters'
import { useCategoriesStore } from '@/store/categories/useCategoriesStore'
import { useUnitiesStore } from '@/store/unities/useUnitiesStore'
import Pagination from '@/components/blocks/pagination'
import { useCartStore } from '@/store/cart/useCartStore'
import AddCartItem from './AddCartItem'
import { Link } from 'react-router'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { useSavedStore } from '@/store/products/useSavedStore'
import { toast } from 'sonner'
import Footer from '@/components/pages/Footer'
import useProducts from '@/hooks/products/useProducts'

const spaceBaseUrl = import.meta.env.VITE_AWS_SPACE_BASE_URL + '/'

export const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const inStock = product.stock > 0
  const productPrice = Number(product.price)
  const productSecondPrice = Number(product.secondPrice ?? 0)
  const firstProductImage = product.images.find((image) => image.displayOrder === 1)?.s3Key

  const deleteItem = useCartStore((state) => state.deleteItem)
  const isProductInCart = useCartStore((state) =>
    state.items.some((item) => item.productId === product.id)
  )
  const saveProduct = useSavedStore((state) => state.addProduct)
  const removeSaved = useSavedStore((state) => state.removeProduct)
  const isProductSaved = useSavedStore((state) => state.products.some((p) => p.id === product.id))

  const handleSaveItem = async ({ product }: { product: Product }) => {
    saveProduct(product)
    toast.success('Producto guardado en favoritos correctamente')
  }

  const handleUnSaveItem = async ({ productId }: { productId: string }) => {
    removeSaved(productId)
    toast.success('Producto eliminado de favoritos correctamente')
  }

  const handleRemoveCartItem = async ({ productId }: { productId: string }) => {
    deleteItem(productId)
    toast.success('Producto eliminado del carrito correctamente')
  }

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg pt-0 w-full max-w-md">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Link to={`/products/${product.slug}`} viewTransition>
            <figure className="w-full h-full overflow-hidden">
              <img
                style={{
                  viewTransitionName: `ProductImage-${firstProductImage}`,
                }}
                loading="lazy"
                alt={product.name}
                src={
                  product.images.length > 0
                    ? spaceBaseUrl + firstProductImage
                    : ProductImagePlaceholder
                }
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </figure>
          </Link>
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {isProductSaved ? (
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8 cursor-pointer"
                onClick={() => handleUnSaveItem({ productId: product.id })}
              >
                <HeartOffIcon className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 cursor-pointer"
                onClick={() => handleSaveItem({ product })}
              >
                <HeartIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 font-serif">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {productSecondPrice && productSecondPrice > 0 ? (
                <>
                  <span className="font-serif text-lg font-bold">
                    ${productSecondPrice.toFixed(2)}
                  </span>
                  <span className="font-serif text-sm text-muted-foreground line-through">
                    ${productPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="font-serif text-lg font-bold">${productPrice.toFixed(2)}</span>
              )}
            </div>
            {isProductInCart ? (
              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600 cursor-pointer text-white font-serif"
                disabled={!inStock}
                onClick={() => handleRemoveCartItem({ productId: product.id })}
              >
                <XIcon className="h-4 w-4 mr-1 font-bold" />
                Remover
              </Button>
            ) : (
              <AddCartItem contentText={'Agregar'} size={'sm'} product={product} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

const ProductListItem = memo(function ProductListItem({ product }: { product: Product }) {
  const inStock = product.stock > 0
  const productPrice = Number(product.price)
  const productSecondPrice = Number(product.secondPrice ?? 0)
  const firstProductImage = product.images.find((image) => image.displayOrder === 1)?.s3Key

  const categories = useCategoriesStore((state) => state.categories)
  const unities = useUnitiesStore((state) => state.unities)
  const deleteItem = useCartStore((state) => state.deleteItem)
  const isProductInCart = useCartStore((state) =>
    state.items.some((item) => item.productId === product.id)
  )
  const saveProduct = useSavedStore((state) => state.addProduct)
  const removeSaved = useSavedStore((state) => state.removeProduct)
  const isProductSaved = useSavedStore((state) => state.products.some((p) => p.id === product.id))

  const handleSaveItem = async ({ product }: { product: Product }) => {
    saveProduct(product)
    toast.success('Producto guardado en favoritos correctamente')
  }

  const handleUnSaveItem = async ({ productId }: { productId: string }) => {
    removeSaved(productId)
    toast.success('Producto eliminado de favoritos correctamente')
  }

  const handleRemoveCartItem = async ({ productId }: { productId: string }) => {
    deleteItem(productId)
    toast.success('Producto eliminado del carrito correctamente')
  }

  return (
    <Card className="overflow-x-scroll overflow-y-hidden sm:overflow-hidden py-0">
      <CardContent className="p-0">
        <div className="flex gap-2">
          <Link to={`/products/${product.slug}`} viewTransition>
            <figure className="relative w-48 h-48 shrink-0">
              <img
                style={{
                  viewTransitionName: `ProductImage-${
                    firstProductImage ?? ProductImagePlaceholder
                  }`,
                }}
                loading="lazy"
                alt={product.name}
                className="w-full h-full object-cover"
                src={
                  product.images.length > 0
                    ? spaceBaseUrl + firstProductImage
                    : ProductImagePlaceholder
                }
              />
              {!inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="secondary">Out of Stock</Badge>
                </div>
              )}
            </figure>
          </Link>

          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className="mb-2">
                    {categories.map((cat) => cat.id === product.categoryId && cat.name)}
                  </Badge>
                  <Badge variant="outline" className="mb-2">
                    {unities.map((unity) => unity.id === product.unityId && unity.name)}
                  </Badge>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">{product.description}</p>

            <div className="flex items-center justify-between gap-2">
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
                {isProductSaved ? (
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => handleUnSaveItem({ productId: product.id })}
                  >
                    <HeartOffIcon className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => handleSaveItem({ product })}
                  >
                    <HeartIcon className="h-4 w-4" />
                  </Button>
                )}
                {isProductInCart ? (
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 cursor-pointer text-white"
                    disabled={!inStock}
                    onClick={() => handleRemoveCartItem({ productId: product.id })}
                  >
                    <XIcon className="h-4 w-4 mr-2 font-bold" />
                    Remover
                  </Button>
                ) : (
                  <AddCartItem
                    contentText={'Agregar al carrito'}
                    size={'default'}
                    product={product}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

function ProductsPage() {
  const [limit, setLimit] = useState(12)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const user = useAuthStore((state) => state.user)
  const setUserId = useProductsStore((state) => state.setUserId)

  const { productsQuery, setNextPage, setPrevPage, setPageNumber } = useProducts({})

  // const fetchData = useCallback(
  //   async (params?: ProductFilterParams) => {
  //     setIsLoading(true)
  //     try {
  //       const { data } = await getProducts(params)
  //       setProducts(data.objects)
  //       setPaginationData({ ...data })
  //     } catch (error) {
  //       console.error('Error al obtener productos', error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   },
  //   [setProducts, setPaginationData]
  // )

  useEffect(() => {
    if (user) setUserId(user.id)
  }, [setUserId, user])

  // useEffect(() => {
  //   fetchData({ limit, page })
  // }, [fetchData, limit, page])

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
          {/* Desktop Sidebar */}
          <FiltersBar
            limit={limit}
            setSearch={setSearch}
            search={search}
            setLimit={setLimit}
            recordsPerPage={[1, 2, 3]}
          />

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
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {productsQuery.data?.objects.map((product) => (
                      <ProductListItem key={product.id} product={product} />
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
