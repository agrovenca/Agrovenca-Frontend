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
import { Checkbox } from '@/components/ui/checkbox'
import { TrashIcon } from 'lucide-react'
import useDeleteProduct from '@/hooks/products/useDeleteProduct'
import { Product } from '@/types/product'

type Props = {
  product: Product
  children?: React.ReactNode
}

function DeleteProduct({ product, children }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { deleteProductMutation } = useDeleteProduct()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    deleteProductMutation.mutate(
      { id: product.id },
      {
        onSuccess: ({ message }) => {
          toast.success(message)
        },
        onError: () => {
          toast.error('Error al eliminar el producto')
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
          <Button size={'icon'} variant={'ghost'} className="cursor-pointer text-red-500">
            <TrashIcon />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar producto</DialogTitle>
          <DialogDescription>Estás a punto de eliminar esta producto</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit} id="deleteForm">
          <div className="flex items-center space-x-2">
            <Checkbox id="confirmDeletion" required />
            <label
              htmlFor="confirmDeletion"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Esta acción es irreversible. ¿Seguro que desea proceder?
            </label>
          </div>

          {deleteProductMutation.isError && (
            <ErrorForm message={deleteProductMutation.error.message} />
          )}

          <Button type="submit" disabled={deleteProductMutation.isPending} form="deleteForm">
            {deleteProductMutation.isPending ? <Loader size="sm" variant="spinner" /> : 'Eliminar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteProduct
