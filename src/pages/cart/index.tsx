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
import { useCartStore } from '@/store/cart/useCartStore'
import { Product } from '@/types/product'
import { ShoppingCartIcon, TrashIcon } from 'lucide-react'
import ProductImagePlaceholder from '@/assets/images/productImagePlaceholder.png'
import UpdateCartItem from '../products/UpdateCartItem'
import { Link } from 'react-router'
import { useAuthStore } from '@/store/auth/useAuthStore'

function CartPage() {
  const user = useAuthStore((state) => state.user)
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const deleteItem = useCartStore((state) => state.deleteItem)

  const getProductPrice = (product: Product) =>
    product.secondPrice && product.secondPrice != 0 ? product.secondPrice : product.price
  const productImage = (product: Product) => product.images[0]?.s3Key || ProductImagePlaceholder
  const totalPrice = items
    .map((i) => getProductPrice(i.product) * i.quantity)
    .reduce((acc, price) => acc + price, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={'icon'} variant={'ghost'} title="Carrito de compras">
          <ShoppingCartIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrito de compras</SheetTitle>
          <SheetDescription>Productos que están en tu carrito de compras</SheetDescription>
        </SheetHeader>
        <section className="px-4 flex flex-col gap-2">
          {items.length <= 0
            ? 'No hay items en el carrito'
            : items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-2 p-4 rounded-md bg-slate-200 dark:bg-gray-800"
                >
                  <Link to={`/products/${item.productId}`} viewTransition>
                    <figure className="w-12 h-12 overflow-hidden rounded-md">
                      <img
                        style={{
                          viewTransitionName: `ProductImage-${productImage(item.product)}`,
                        }}
                        loading="lazy"
                        alt="Imagen del producto"
                        src={productImage(item.product)}
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
                      <p>{item.product.name}</p>
                      <p>
                        <span>
                          {item.quantity} x ${Number(getProductPrice(item.product)).toFixed(2)}
                        </span>
                        {' = '}
                        <span>
                          ${Number(getProductPrice(item.product) * item.quantity).toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2 flex-col">
                      <button
                        className="w-5 h-5 transition text-red-500 hover:text-red-600 cursor-pointer"
                        onClick={() => deleteItem(item.productId)}
                      >
                        <TrashIcon className="w-full h-full" />
                      </button>
                      <UpdateCartItem item={item} />
                    </div>
                  </div>
                </div>
              ))}
        </section>
        <div className="flex justify-center items-center">
          <p>
            <span className="font-bold">Total: </span>${totalPrice.toFixed(2)}
          </p>
        </div>
        <SheetFooter>
          {items.length < 1 || !user ? (
            <Button
              disabled
              size={'lg'}
              variant={'outline'}
              className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-600 w-full uppercase cursor-not-allowed"
            >
              Continuar
            </Button>
          ) : (
            <Button
              asChild
              size={'lg'}
              variant={'outline'}
              className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-600 w-full uppercase cursor-pointer"
            >
              <Link to={'/checkout'}>Continuar</Link>
            </Button>
          )}
          <Button
            size={'lg'}
            variant={'outline'}
            onClick={clearCart}
            disabled={items.length < 1}
            className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-500 dark:hover:bg-red-600 w-full uppercase"
          >
            Vaciar carrito
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default CartPage
