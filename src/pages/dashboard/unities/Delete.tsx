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
import { Unity } from '@/types/unity'
import useDeleteUnity from '@/hooks/unities/useDeleteUnity'

type Props = {
  unity: Unity
  children?: React.ReactNode
}

function DeleteUnity({ unity, children }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { deleteUnityMutation } = useDeleteUnity()
  const [checked, setChecked] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    deleteUnityMutation.mutate(
      { id: unity.id },
      {
        onSuccess: (unityResponse) => {
          toast.success(unityResponse.message)
        },
        onError: () => {
          toast.error('Error al eliminar la unidad')
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
          <DialogTitle>Eliminar unidad</DialogTitle>
          <DialogDescription>Estás a punto de eliminar esta unidad</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit} id="deleteForm">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirmDeletion"
              required
              checked={checked}
              onCheckedChange={() => setChecked((prev) => !prev)}
            />
            <label
              htmlFor="confirmDeletion"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Esta acción es irreversible. ¿Seguro que desea proceder?
            </label>
          </div>

          {deleteUnityMutation.isError && <ErrorForm message={deleteUnityMutation.error.message} />}

          <Button
            size={'lg'}
            type="submit"
            form="deleteForm"
            variant={'destructive'}
            className={`w-full font-serif uppercase ${
              deleteUnityMutation.isPending || !checked ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            disabled={deleteUnityMutation.isPending || !checked}
          >
            {deleteUnityMutation.isPending ? <Loader size="sm" variant="spinner" /> : 'Eliminar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteUnity
