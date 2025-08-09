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
import { HeartIcon, TrashIcon } from 'lucide-react'
import { Link } from 'react-router'
import { useSavedStore } from '@/store/products/useSavedStore'
import { getProductPrice } from '@/lib/getProductPrice'
import { Product } from '@/types/product'
import ProductImage from '@/components/pages/products/ProductImage'

function RenderSavedItem({ product }: { product: Product }) {
  const removeProduct = useSavedStore((state) => state.removeProduct)

  return (
    <div className="flex gap-2 p-4 rounded-md bg-slate-200 dark:bg-gray-800">
      <Link to={`/products/${product.id}`} viewTransition>
        <figure className="w-12 h-12 overflow-hidden rounded-md">
          <ProductImage product={product} className="w-full h-full" />
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
  )
}

function SavedProductsPage() {
  const products = useSavedStore((state) => state.products)
  const clear = useSavedStore((state) => state.clear)

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
      <SheetContent className="w-4/4">
        <SheetHeader>
          <SheetTitle>Lista de favoritos</SheetTitle>
          <SheetDescription>Productos que anteriormente has marcado como favorito</SheetDescription>
        </SheetHeader>
        <section className="px-4 flex flex-col gap-2">
          {products.length <= 0
            ? 'No hay productos favoritos'
            : products.map((product) => <RenderSavedItem key={product.id} product={product} />)}
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
