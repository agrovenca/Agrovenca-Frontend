import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircleIcon, HeartIcon, HeartOffIcon } from 'lucide-react'

import { useCartStore } from '@/store/cart/useCartStore'
import { Product } from '@/types/product'
import { Link } from 'react-router-dom'
import AddCartItem from './AddCartItem'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import useCategories from '@/hooks/categories/useCategories'
import useUnities from '@/hooks/unities/useUnities'
import { useProductActions } from '@/hooks/products/useActions'
import useProductPrefetch from '@/hooks/products/useProductPrefetch'
import { getFirstProductImage, productImagePlaceholder } from '@/lib/utils'

function RenderSaveButtons({ product }: { product: Product }) {
  const { handleSaveItem, handleUnSaveItem, isProductSaved } = useProductActions(product)
  return isProductSaved ? (
    <Button
      size="icon"
      variant="destructive"
      className="h-9 w-9 cursor-pointer"
      onClick={() => handleUnSaveItem({ productId: product.id })}
    >
      <HeartOffIcon className="h-4 w-4" />
    </Button>
  ) : (
    <Button
      size="icon"
      variant="secondary"
      className="h-9 w-9 cursor-pointer"
      onClick={() => handleSaveItem({ product })}
    >
      <HeartIcon className="h-4 w-4" />
    </Button>
  )
}

function ProductItem({
  product,
  renderMode,
}: {
  product: Product
  renderMode: 'card' | 'listItem'
}) {
  const inStock = product.stock > 0
  const productPrice = Number(product.price)
  const productSecondPrice = Number(product.secondPrice ?? 0)
  const priceToShow = productSecondPrice ? productSecondPrice : productPrice

  const { categoriesQuery } = useCategories()
  const { unitiesQuery } = useUnities()
  const { prefetch } = useProductPrefetch()

  const isProductInCart = useCartStore((state) =>
    state.items.some((item) => item.productId === product.id)
  )

  const firstImage = getFirstProductImage(product.images)

  if (renderMode === 'listItem') {
    return (
      <Card
        onMouseEnter={() => prefetch({ slug: product.slug })}
        className="overflow-x-scroll max-w-md md:max-w-full overflow-y-hidden sm:overflow-hidden py-0 animate-fadeIn"
      >
        <CardContent className="p-0">
          <div className="flex gap-2 flex-col md:flex-row">
            <Link to={`/products/${product.slug}`} viewTransition>
              <figure className="relative w-full md:w-[250px] h-full shrink-0">
                <img
                  src={firstImage.s3Key}
                  style={{
                    viewTransitionName: `ProductImage-${firstImage.id}`,
                  }}
                  loading="lazy"
                  alt={product.name}
                  className="w-full h-full object-cover aspect-video"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = productImagePlaceholder
                  }}
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
                      {categoriesQuery.isFetching
                        ? 'Cargando...'
                        : categoriesQuery.data?.map(
                            (cat) => cat.id === product.categoryId && cat.name
                          )}
                    </Badge>
                    <Badge variant="outline" className="mb-2">
                      {unitiesQuery.isFetching
                        ? 'Cargando...'
                        : unitiesQuery.data?.map(
                            (unity) => unity.id === product.unityId && unity.name
                          )}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-4">{product.description}</p>

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
                  <RenderSaveButtons product={product} />
                  {isProductInCart ? (
                    <Button size="lg" className="bg-primary/90" disabled>
                      <CheckCircleIcon className="h-4 w-4 font-bold" />
                      <span className="font-serif uppercase">En el carrito</span>
                    </Button>
                  ) : (
                    <AddCartItem contentText={'Agregar al carrito'} size={'lg'} product={product} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div
      onMouseEnter={() => prefetch({ slug: product.slug })}
      className="group animate-fadeIn relative mx-auto overflow-hidden border rounded-lg shadow-sm p-2 flex bg-[#fafae6] dark:bg-transparent flex-col transition-colors hover:border-primary h-full max-w-sm w-full"
    >
      <Link to={`/products/${product.slug}`} viewTransition>
        <figure className="aspect-square overflow-hidden rounded-md flex-1 h-[300px] w-full">
          <img
            src={firstImage.s3Key}
            style={{
              viewTransitionName: `ProductImage-${firstImage.id}`,
            }}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 aspect-video"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = productImagePlaceholder
            }}
          />
        </figure>
      </Link>
      {!inStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Badge variant="secondary">Sin existencias</Badge>
        </div>
      )}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <RenderSaveButtons product={product} />
      </div>
      <Separator />
      <div className="p-4 flex flex-col gap-2 h-full">
        <div className="flex-1">
          <h3 className="font-medium text-lg md:text-xl">{product.name}</h3>
          <p className="text-sm md:text-base text-muted-foreground mb-3 line-clamp-2 font-serif">
            {product.description}
          </p>
          <p className="text-sm text-muted-foreground">${priceToShow.toFixed(2)}</p>
        </div>
        <div className="mt-auto pt-2">
          {isProductInCart ? (
            <Button size={'lg'} className="bg-primary/80 w-full" disabled>
              <CheckCircleIcon />
              <span className="font-serif uppercase">En el carrito</span>
            </Button>
          ) : (
            <AddCartItem contentText={'Agregar'} size={'lg'} product={product} className="w-full" />
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductItem
