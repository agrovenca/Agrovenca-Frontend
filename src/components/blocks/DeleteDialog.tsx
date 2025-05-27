import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import { FormEvent, useState } from 'react'
import ErrorForm from '@/components/pages/ErrorForm'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { Loader } from '@/components/ui/loader'
import { Checkbox } from '../ui/checkbox'

type Props = {
  title?: string
  description?: string
  warningText?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: () => Promise<any>
  callback?: () => void
}

const defaultDescription = 'Estás a punto de eliminar este regístro'
const defaultWarningText = 'Esta acción es irreversible. ¿Seguro que desea eliminar?'

function DeleteDialog({
  title = 'Eliminar',
  description = defaultDescription,
  warningText = defaultWarningText,
  action,
  callback,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const res = await action()

    if (res.error) {
      setError(res.error)
      setIsLoading(false)
      return
    }

    if (res.status === 200) {
      const { message } = res.data
      toast.success(message)
      setIsOpen(false)
      setIsLoading(false)
      if (callback) {
        callback()
      }
      return
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'icon'} variant={'ghost'} className="cursor-pointer text-red-500">
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center space-x-2">
            <Checkbox id="confirmDeletion" required />
            <label
              htmlFor="confirmDeletion"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {warningText}
            </label>
          </div>

          {errorStatus.error && <ErrorForm message={errorStatus.message} />}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader size="sm" variant="spinner" /> : 'Eliminar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteDialog
