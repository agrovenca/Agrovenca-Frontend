import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { FormEvent, useState } from 'react'
import ErrorForm from '@/components/pages/ErrorForm'
import { Loader } from '@/components/ui/loader'
import { HashIcon } from 'lucide-react'
import { Product } from '@/types/product'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useReorderProduct } from '@/hooks/products/useReorderProducts'

type Props = {
  product: Product
  maxOrder: number
  children?: React.ReactNode
}

function UpdateProductOrder({ product, maxOrder, children }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [newOrder, setNewOrder] = useState(product.displayOrder)
  const { reorderSingleMutation } = useReorderProduct()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsOpen(false)
    reorderSingleMutation.mutate(
      { id: product.id, displayOrder: newOrder },
      {
        onSuccess: ({ message }) => {
          toast.success(message)
        },
        onError: () => {
          setIsOpen(true)
          toast.error('Error al actualizar el orden de los productos')
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button
            variant={'ghost'}
            size={'icon'}
            className="text-yellow-500 cursor-pointer"
            title="Ver producto"
          >
            <HashIcon />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar orden numérico</DialogTitle>
          <DialogDescription>
            <span className="font-bold">Número actual:</span> {product.displayOrder}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit} id="reorderForm">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="newProductOrder">Nuevo orden</Label>
            <Input
              type="number"
              id="newProductOrder"
              placeholder="Nuevo número de orden"
              min={0}
              max={maxOrder}
              onChange={(e) => setNewOrder(Number(e.target.value))}
              value={newOrder}
            />
          </div>

          {reorderSingleMutation.isError && (
            <ErrorForm message={reorderSingleMutation.error.message} />
          )}

          <div className="flex gap-2 items-center">
            <Button
              type="reset"
              variant={'secondary'}
              form="reorderForm"
              onClick={() => setNewOrder(product.displayOrder)}
              disabled={newOrder === product.displayOrder || reorderSingleMutation.isPending}
            >
              Reiniciar
            </Button>
            <Button
              type="submit"
              form="reorderForm"
              disabled={newOrder === product.displayOrder || reorderSingleMutation.isPending}
            >
              {reorderSingleMutation.isPending ? (
                <Loader size="sm" variant="spinner" />
              ) : (
                'Actualizar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateProductOrder
