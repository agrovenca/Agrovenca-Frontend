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
import { ShippingAddress } from '@/types/shippingAddress'
import useDeleteShippingAddress from '@/hooks/shipping/useDeleteShippingAddress'

type Props = {
  userId: string
  address: ShippingAddress
  children?: React.ReactNode
}

function DeleteAddress({ address, userId, children }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { deleteAddressMutation } = useDeleteShippingAddress({ userId })
  const [checked, setChecked] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsOpen(false)
    deleteAddressMutation.mutate(
      { pk: address.pk },
      {
        onSuccess: ({ message }) => {
          console.log('Address deleted: ', address.alias)
          toast.success(message)
        },
        onError: () => {
          toast.error('Error al eliminar la dirección')
          setIsOpen(true)
        },
        onSettled: () => {
          setChecked(false)
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
          <DialogTitle>Eliminar dirección</DialogTitle>
          <DialogDescription>Estás a punto de eliminar esta dirección</DialogDescription>
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

          {deleteAddressMutation.isError && (
            <ErrorForm message={deleteAddressMutation.error.message} />
          )}

          <div className="flex">
            <Button
              size={'lg'}
              type="submit"
              form="deleteForm"
              variant={'destructive'}
              className={`w-full font-serif uppercase ${
                deleteAddressMutation.isPending || !checked
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              disabled={deleteAddressMutation.isPending || !checked}
            >
              {deleteAddressMutation.isPending ? (
                <Loader size="sm" variant="spinner" />
              ) : (
                'Eliminar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteAddress
