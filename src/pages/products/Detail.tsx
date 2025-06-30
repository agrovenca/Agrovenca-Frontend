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
import { getProduct, getProducts } from '@/actions/products'
import ProductImagePlaceholder from '@/assets/images/productImagePlaceholder.png'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Heart, Minus, Plus, RotateCcw, Share2, Shield, ShoppingCart, Truck } from 'lucide-react'
import { useCartStore } from '@/store/cart/useCartStore'
import { parseFormattedText } from '@/lib/utils'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import { ProductCard } from '.'
import { useProductsStore } from '@/store/products/useProductsStore'
import { useAuthStore } from '@/store/auth/useAuthStore'

function ProductDetail() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const [count, setCount] = useState(0)
  const [current, setCurrent] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [api, setApi] = useState<CarouselApi>()
  const [product, setProduct] = useState<Product>()
  const [recommended, setRecommended] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const user = useAuthStore((state) => state.user)
  const setUserId = useProductsStore((state) => state.setUserId)
  const products = useProductsStore((state) => state.products)
  const filteredProducts = recommended.filter((p) => p.id !== product?.id)
  const addItem = useCartStore((state) => state.addItem)
  const deleteItem = useCartStore((state) => state.deleteItem)

  const productStock = product?.stock ?? 0
  const inStock = productStock > 0
  const productPrice = Number(product?.price)
  const productSecondPrice = Number(product?.secondPrice ?? 0)
  const productPriceToShow = productSecondPrice ? productSecondPrice : productPrice
  const savingPrice = Number(productPrice - productSecondPrice).toFixed(2)
  const savingPercentage = Number(100 - (productSecondPrice * 100) / productPrice).toFixed(2)
  const itemInCart = useCartStore((state) =>
    state.items.find((item) => item.productId === product?.id)
  )
  const parsed = parseFormattedText(product?.description)

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

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, Math.min(productStock, quantity + change)))
  }

  const handleAddCartItem = async ({
    product,
    quantity,
  }: {
    product: Product
    quantity: number
  }) => {
    addItem({ product, productId: product.id, quantity })
    toast.success('Producto añadido al carrito correctamente')
  }

  const handleRemoveCartItem = async ({ productId }: { productId: string }) => {
    deleteItem(productId)
    toast.success('Producto eliminado del carrito correctamente')
  }

  useEffect(() => {
    if (!slug?.trim()) {
      navigate('/products')
    }
  }, [slug, navigate])

  useEffect(() => {
    const productId = products.find((p) => p.slug === slug)?.id
    fetchProduct(productId || '')
  }, [slug, fetchProduct, products])

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

  useEffect(() => {
    if (user) setUserId(user.id)
  }, [setUserId, user])

  useEffect(() => {
    if (!product) return

    const fetchRecommended = async () => {
      try {
        const res = await getProducts({ categoriesIds: [product.categoryId], limit: 9 })
        setRecommended(res.data.objects)
      } catch (error) {
        console.error('Error al obtener productos recomendados', error)
      }
    }

    fetchRecommended()
  }, [product])

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
      <div className="container mx-auto py-4">
        <section className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
          <section className="p-4 rounded-xs col-span-1 sm:col-span-2 md:col-span-3">
            {!product.images?.length ? (
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
                  <div className="flex gap-2 justify-center items-baseline mt-2">
                    <CarouselPrevious className="relative left-0 top-0 translate-none" />
                    <CarouselNext className="relative left-0 top-0 translate-none" />
                  </div>
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
                {!itemInCart && (
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
                )}

                <div className="flex gap-3 flex-wrap">
                  {itemInCart ? (
                    <Button
                      size="lg"
                      disabled={!inStock}
                      variant={'destructive'}
                      className="flex-1 cursor-pointer"
                      onClick={() => handleRemoveCartItem({ productId: product.id })}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Remover del carrito
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      disabled={!inStock}
                      onClick={() => handleAddCartItem({ product, quantity })}
                      className="flex-1 bg-green-600 hover:bg-green-700"
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
        <div className="p-4">
          {parsed.map((block, idx) => {
            if (block.type === 'paragraph') {
              return (
                <p
                  key={idx}
                  className="font-serif"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              )
            }
            if (block.type === 'list-item') {
              return (
                <li
                  key={idx}
                  className="font-serif"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              )
            }
            return null
          })}
        </div>
        {product.videoId && product.videoId.length > 0 && (
          <div className="flex items-center my-40">
            <div className="mx-auto border w-full max-w-3xl rounded-md overflow-hidden">
              <LiteYouTubeEmbed
                aspectHeight={9}
                aspectWidth={16}
                id={product.videoId}
                title={`${product.name}`}
              />
            </div>
          </div>
        )}
        {filteredProducts.length > 0 && (
          <section className="my-6 mx-auto">
            <h4 className="font-bold text-3xl mb-8 text-center">
              Productos recomendados ({filteredProducts.length})
            </h4>
            <Carousel opts={{ align: 'start', loop: true }} className="px-4">
              <div className="flex gap-2 justify-center items-baseline my-4">
                <CarouselPrevious className="relative left-0 top-0 translate-none" />
                <CarouselNext className="relative left-0 top-0 translate-none" />
              </div>
              <CarouselContent>
                {filteredProducts.map((product) => (
                  <CarouselItem key={product.id} className="basis-4/4 sm:basis-1/4">
                    <ProductCard product={product} key={product.id} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
