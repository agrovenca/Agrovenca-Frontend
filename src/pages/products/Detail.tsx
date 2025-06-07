import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Navbar from '@/components/pages/HomeNavbar'
import { Loader } from '@/components/ui/loader'

import { toast } from 'sonner'
import { Product } from '@/types/product'
import { getProduct } from '@/actions/products'
import ProductImagePlaceholder from '@/assets/images/productImagePlaceholder.png'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Heart, Minus, Plus, RotateCcw, Share2, Shield, ShoppingCart, Truck } from 'lucide-react'
import { useCartStore } from '@/store/cart/useCartStore'

function ProductDetail() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const [product, setProduct] = useState<Product>()
  const [isLoading, setIsLoading] = useState(false)
  const [count, setCount] = useState(0)
  const [current, setCurrent] = useState(0)
  const [api, setApi] = useState<CarouselApi>()
  const [quantity, setQuantity] = useState(1)

  const fetchProduct = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        const res = await getProduct({ productId: id })
        if (res.status === 404) {
          toast.error(res.error)
          navigate('/products')
          return
        }
        setProduct(res.data.product)
      } catch (error) {
        console.error('Error al obtener productos', error)
      } finally {
        setIsLoading(false)
      }
    },
    [navigate]
  )

  useEffect(() => {
    if (!productId || productId.length < 1) {
      navigate('/products')
    }
  }, [productId, navigate])

  useEffect(() => {
    fetchProduct(productId as string)
  }, [productId, fetchProduct])

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const productStock = product?.stock ?? 0
  const inStock = productStock > 0
  const productPrice = Number(product?.price)
  const productSecondPrice = Number(product?.secondPrice ?? 0)
  const productPriceToShow = Math.min(productPrice, productSecondPrice)
  const savingPrice = Number(productPrice - productSecondPrice).toFixed(2)
  const savingPercentage = Number(100 - (productSecondPrice * 100) / productPrice).toFixed(2)
  const isProductInCart = useCartStore((state) =>
    state.items.some((item) => item.productId === product?.id)
  )

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, Math.min(productStock, quantity + change)))
  }

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center h-full w-full gap-2">
        <Loader size="md" />
        <span>Cargando...</span>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <section className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 container mx-auto py-4 gap-4">
        <section className="p-4 rounded-xs col-span-1 sm:col-span-2 md:col-span-3">
          {product.images.length < 1 ? (
            <figure className="w-full h-full overflow-hidden rounded-md">
              <img
                loading="lazy"
                src={ProductImagePlaceholder}
                alt="Imagen ejemplo del producto"
                className="w-full h-full object-cover aspect-video"
              />
            </figure>
          ) : (
            <div className="border rounded-md">
              <Carousel setApi={setApi} opts={{ align: 'start', loop: true }}>
                <CarouselContent>
                  {product.images.map((image) => (
                    <CarouselItem key={image.id}>
                      <figure className="w-full h-full overflow-hidden rounded-md">
                        <img
                          loading="lazy"
                          src={image.s3Key}
                          className="w-full h-full object-cover aspect-video"
                          alt={`Imagen número ${image.displayOrder} del producto`}
                        />
                      </figure>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <div className="text-muted-foreground py-2 text-center text-sm">
                Imagen {current} de {count}
              </div>
            </div>
          )}
        </section>
        <section className="p-4 rounded-xs col-span-1 md:col-span-2">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl">{product.name}</h1>
            <div className="py-4">
              {productSecondPrice && productSecondPrice > 0 ? (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">${productSecondPrice.toFixed(2)}</span>
                    <span className="text-lg text-muted-foreground line-through">
                      ${productPrice.toFixed(2)}
                    </span>
                  </div>
                  <p>
                    Ahorras ${savingPrice} ({savingPercentage}% menos)
                  </p>
                </div>
              ) : (
                <span className="text-lg font-bold">${productPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="space-y-2">
              {inStock ? (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-green-600">
                    En stock ({product.stock} disponible)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium text-red-600">Agotado</span>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Cantidad:</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                {isProductInCart ? (
                  <Button
                    size="lg"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={!inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Remover del carrito
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={!inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Agregar al carrito - ${(productPriceToShow * quantity).toFixed(2)}
                  </Button>
                )}
                <Button variant="outline" size="lg" className={'text-red-500 border-red-500'}>
                  <Heart className={`h-4 w-4`} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">Orders over $25</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Quality Guarantee</p>
                  <p className="text-xs text-muted-foreground">100% organic</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">7-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  )
}

export default ProductDetail
