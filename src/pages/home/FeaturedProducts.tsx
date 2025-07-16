import { getProducts } from '@/actions/products'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Product } from '@/types/product'
import { useEffect, useState } from 'react'
import ProductImagePlaceholder from '@/assets/images/productImagePlaceholder.png'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cart/useCartStore'
import { toast } from 'sonner'
import { ChevronRight, XIcon } from 'lucide-react'
import AddCartItem from '../products/AddCartItem'
import { Separator } from '@/components/ui/separator'

const spaceBaseUrl = import.meta.env.VITE_AWS_SPACE_BASE_URL + '/'

function ProductCard({ product }: { product: Product }) {
  const inStock = product.stock > 0
  const productPrice = Number(product.price)
  const productSecondPrice = Number(product.secondPrice ?? 0)
  const priceToShow = productSecondPrice ? productSecondPrice : productPrice
  const firstProductImage = product.images.length
    ? product.images.find((image) => image.displayOrder === 1)?.s3Key
    : ProductImagePlaceholder

  const deleteItem = useCartStore((state) => state.deleteItem)
  const isProductInCart = useCartStore((state) =>
    state.items.some((item) => item.productId === product.id)
  )

  const handleRemoveCartItem = async ({ productId }: { productId: string }) => {
    deleteItem(productId)
    toast.success('Producto eliminado del carrito correctamente')
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-2 flex flex-col transition-colors hover:border-primary h-full">
      <Link to={`/products/${product.slug}`} viewTransition>
        <figure className="aspect-square overflow-hidden rounded-md flex-1 h-[300px] w-full">
          <img
            src={
              product.images.length > 0 ? spaceBaseUrl + firstProductImage : ProductImagePlaceholder
            }
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </figure>
      </Link>
      <Separator />
      <div className="p-4 flex flex-col gap-2 h-full">
        <div className="flex-1">
          <h3 className="font-medium">{product.name}</h3>
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

function FeaturedProducts() {
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const limit = 4

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const { data } = await getProducts({ limit })
        if (!data) {
          throw new Error('Failed to fetch featured products')
        }

        setProducts(data.objects)
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container space-y-12 mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(limit)].map((_, i) => (
              <Card key={i} className="animate-pulse h-[350px] bg-muted" />
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Productos destacados
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Nuestros productos agrícolas más vendidos esta temporada
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
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
