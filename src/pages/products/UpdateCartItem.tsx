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
import { CartItem } from '@/types/cart'

import { EditIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  item: CartItem
  iconOnly?: boolean
}

function UpdateCartItem({ item, iconOnly = true }: Props) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [isOpen, setIsOpen] = useState(false)
  const isValid = quantity > item.product.stock

  const updateItem = useCartStore((state) => state.updateItem)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsOpen(false)
    updateItem({ ...item, quantity })
    toast.success('Item actualizado correctamente')
  }

  useEffect(() => {
    if (isOpen) {
      setQuantity(quantity)
    }
  }, [isOpen, quantity])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {iconOnly ? (
          <button className="w-5 h-5 transition text-blue-500 hover:text-blue-600 cursor-pointer">
            <EditIcon className="w-full h-full" />
          </button>
        ) : (
          <Button
            className="transition text-blue-500 hover:text-blue-600 cursor-pointer w-full"
            variant={'outline'}
          >
            <EditIcon className="w-5 h-5" />
            <span>Editar</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar este producto al carrito</DialogTitle>
          <DialogDescription>Elija la cantidad para agregar al carrito</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Input
              type="number"
              defaultValue={quantity}
              max={item.product.stock}
              placeholder="Cantidad a agregar"
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <p>
              {quantity}/{item.product.stock}
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

export default UpdateCartItem
