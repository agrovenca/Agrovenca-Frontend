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
import { Category } from '@/types/category'
import { Checkbox } from '@/components/ui/checkbox'
import useDeleteCategory from '@/hooks/categories/useDeleteCategory'
import { TrashIcon } from 'lucide-react'

type Props = {
  category: Category
  children?: React.ReactNode
}

function DeleteCategory({ category, children }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { deleteCategoryMutation } = useDeleteCategory()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    deleteCategoryMutation.mutate(
      { id: category.id },
      {
        onSuccess: ({ message }) => {
          toast.success(message)
        },
        onError: () => {
          toast.error('Error al eliminar la categoría')
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
          <DialogTitle>Eliminar categoría</DialogTitle>
          <DialogDescription>Estás a punto de eliminar esta categoría</DialogDescription>
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

          {deleteCategoryMutation.isError && (
            <ErrorForm message={deleteCategoryMutation.error.message} />
          )}

          <Button type="submit" disabled={deleteCategoryMutation.isPending} form="deleteForm">
            {deleteCategoryMutation.isPending ? <Loader size="sm" variant="spinner" /> : 'Eliminar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteCategory
