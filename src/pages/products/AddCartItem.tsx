import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/store/cart/useCartStore'

import { Product } from '@/types/product'
import { ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  product: Product
  contentText: string
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined
  className?: string
}

function AddCartItem({ product, contentText, size, className = '' }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const inStock = product.stock > 0
  const isValid = quantity > product.stock

  const addItem = useCartStore((state) => state.addItem)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsOpen(false)
    addItem({ product, productId: product.id, quantity })
    toast.success('Producto añadido al carrito correctamente')
  }

  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size={size}
          className={`bg-primary cursor-pointer font-serif ${className}`}
          disabled={!inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          {contentText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar este producto al carrito</DialogTitle>
          <DialogDescription className="font-serif">
            Elija la cantidad para agregar al carrito
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Input
              type="number"
              defaultValue={1}
              max={product.stock}
              placeholder="Cantidad a agregar"
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <p>
              {quantity}/{product.stock}
            </p>
          </div>
          <Button
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
            disabled={isValid}
            title={isValid ? 'Agregar al carrito' : 'Cantidad inválida'}
            type="submit"
          >
            Agregar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddCartItem
