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
import { ShoppingCartIcon, TrashIcon } from 'lucide-react'
import UpdateCartItem from '../products/UpdateCartItem'
import { Link } from 'react-router'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { Badge } from '@/components/ui/badge'
import { CartItem } from '@/types/cart'
import { getProductPrice } from '@/lib/getProductPrice'
import ProductImage from '@/components/pages/products/ProductImage'

function RenderCartItem({ item }: { item: CartItem }) {
  const deleteItem = useCartStore((state) => state.deleteItem)

  return (
    <div className="flex gap-2 p-4 rounded-md bg-slate-200 dark:bg-gray-800">
      <Link to={`/products/${item.productId}`} viewTransition>
        <figure className="w-12 h-12 overflow-hidden rounded-md">
          <ProductImage product={item.product} className="w-full h-full" />
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
            <span>${Number(getProductPrice(item.product) * item.quantity).toFixed(2)}</span>
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
  )
}

function RenderContinueButton({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <Button
      asChild
      size={'lg'}
      variant={'outline'}
      className="button-primary w-full uppercase cursor-pointer"
    >
      <Link to={'/checkout'}>Continuar</Link>
    </Button>
  ) : (
    <Button
      disabled
      size={'lg'}
      variant={'outline'}
      className="button-primary w-full uppercase cursor-not-allowed"
    >
      Continuar
    </Button>
  )
}

function CartPage() {
  const user = useAuthStore((state) => state.user)
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)

  const totalPrice = items
    .map((i) => getProductPrice(i.product) * i.quantity)
    .reduce((acc, price) => acc + price, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={'icon'} variant={'ghost'} title="Carrito de compras" className="relative">
          <ShoppingCartIcon />
          {items.length > 0 && (
            <Badge className="absolute bg-primary-foreground text-black top-0 right-0 translate-x-1/2 -translate-y-1/2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
              {items.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-4/4">
        <SheetHeader>
          <SheetTitle>Carrito de compras</SheetTitle>
          <SheetDescription>Productos que están en tu carrito de compras</SheetDescription>
        </SheetHeader>
        <section className="px-4 flex flex-col gap-2">
          {items.length <= 0
            ? 'No hay items en el carrito'
            : items.map((item) => <RenderCartItem key={item.productId} item={item} />)}
        </section>
        <div className="flex justify-center items-center">
          <p>
            <span className="font-bold">Total: </span>${totalPrice.toFixed(2)}
          </p>
        </div>
        <SheetFooter>
          {!user && <p className="text-sm text-center">Debes iniciar sesión para continuar</p>}
          <RenderContinueButton allowed={items.length > 1 || !!user} />
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
