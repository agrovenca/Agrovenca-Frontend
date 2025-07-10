import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Product } from '@/types/product'
import { HeartIcon, TrashIcon } from 'lucide-react'
import ProductImagePlaceholder from '@/assets/images/productImagePlaceholder.png'
import { Link } from 'react-router'
import { useSavedStore } from '@/store/products/useSavedStore'
import { productImage } from '@/lib/utils'

function SavedProductsPage() {
  const products = useSavedStore((state) => state.products)
  const clear = useSavedStore((state) => state.clear)
  const removeProduct = useSavedStore((state) => state.removeProduct)

  const getProductPrice = (product: Product) =>
    product.secondPrice ? product.secondPrice : product.price

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size={'icon'}
          variant={'ghost'}
          className="flex gap-2 items-center"
          title="Favoritos"
        >
          <HeartIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Lista de favoritos</SheetTitle>
          <SheetDescription>Productos que anteriormente has marcado como favorito</SheetDescription>
        </SheetHeader>
        <section className="px-4 flex flex-col gap-2">
          {products.length <= 0
            ? 'No hay productos favoritos'
            : products.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-2 p-4 rounded-md bg-slate-200 dark:bg-gray-800"
                >
                  <Link to={`/products/${product.id}`} viewTransition>
                    <figure className="w-12 h-12 overflow-hidden rounded-md">
                      <img
                        style={{
                          viewTransitionName: `ProductImage-${productImage(product.images)}`,
                        }}
                        loading="lazy"
                        alt="Imagen del producto"
                        src={productImage(product.images)}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = ProductImagePlaceholder
                        }}
                      />
                    </figure>
                  </Link>
                  <div className="flex gap-2 justify-between flex-1">
                    <div className="flex-1">
                      <p>{product.name}</p>
                      <span>${Number(getProductPrice(product)).toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2 flex-col">
                      <button
                        className="w-5 h-5 transition text-red-500 hover:text-red-600 cursor-pointer"
                        onClick={() => removeProduct(product.id)}
                      >
                        <TrashIcon className="w-full h-full" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </section>
        <SheetFooter>
          <Button
            size={'lg'}
            variant={'outline'}
            onClick={clear}
            disabled={products.length < 1}
            className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-500 dark:hover:bg-red-600 w-full uppercase"
          >
            Limpiar lista
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default SavedProductsPage
