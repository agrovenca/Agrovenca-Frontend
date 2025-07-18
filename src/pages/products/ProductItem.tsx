import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HeartIcon, HeartOffIcon, XIcon } from 'lucide-react'

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

function ProductItem({ product, renderMode }: { product: Product; renderMode: 'grid' | 'list' }) {
  const inStock = product.stock > 0
  const productPrice = Number(product.price)
  const productSecondPrice = Number(product.secondPrice ?? 0)
  const priceToShow = productSecondPrice ? productSecondPrice : productPrice

  const { categoriesQuery } = useCategories()
  const { unitiesQuery } = useUnities()
  const { prefetch } = useProductPrefetch()

  const {
    handleRemoveCartItem,
    handleSaveItem,
    handleUnSaveItem,
    isProductSaved,
    getFirstProductImage,
  } = useProductActions(product as Product)

  const isProductInCart = useCartStore((state) =>
    state.items.some((item) => item.productId === product.id)
  )

  const firstProductImage = getFirstProductImage(product.images)

  if (renderMode === 'list') {
    return (
      <Card
        onMouseEnter={() => prefetch({ slug: product.slug })}
        className="overflow-x-scroll overflow-y-hidden sm:overflow-hidden py-0"
      >
        <CardContent className="p-0">
          <div className="flex gap-2">
            <Link to={`/products/${product.slug}`} viewTransition>
              <figure className="relative w-48 h-48 shrink-0">
                <img
                  src={firstProductImage?.s3Key}
                  style={{
                    viewTransitionName: `ProductImage-${firstProductImage?.id}`,
                  }}
                  loading="lazy"
                  alt={product.name}
                  className="w-full h-full object-cover aspect-video"
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
  }

  return (
    <div
      onMouseEnter={() => prefetch({ slug: product.slug })}
      className="group relative overflow-hidden rounded-lg border bg-background p-2 flex flex-col transition-colors hover:border-primary h-full max-w-sm w-full"
    >
      <Link to={`/products/${product.slug}`} viewTransition>
        <figure className="aspect-square overflow-hidden rounded-md flex-1 h-[300px] w-full">
          <img
            src={firstProductImage?.s3Key}
            style={{
              viewTransitionName: `ProductImage-${firstProductImage?.id}`,
            }}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 aspect-video"
          />
        </figure>
      </Link>
      {!inStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Badge variant="secondary">Sin existencias</Badge>
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
      <Separator />
      <div className="p-4 flex flex-col gap-2 h-full">
        <div className="flex-1">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 font-serif">
            {product.description}
          </p>
          <p className="text-sm text-muted-foreground">${priceToShow.toFixed(2)}</p>
        </div>
        <div className="mt-auto pt-2">
          {isProductInCart ? (
            <Button
              size="lg"
              className="bg-red-500 hover:bg-red-600 cursor-pointer text-white font-serif w-full"
              disabled={!inStock}
              onClick={() => handleRemoveCartItem({ productId: product.id })}
            >
              <XIcon className="h-4 w-4 mr-1 font-bold" />
              Remover de carrito
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
