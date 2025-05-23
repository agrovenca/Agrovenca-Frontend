import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dispatch, SetStateAction, useState } from 'react'
import ErrorForm from '@/components/pages/ErrorForm'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { UnitySchema } from '@/schemas/unity'
import { create } from '@/actions/settings/unities'
import { Loader } from '@/components/ui/loader'
import { Unity } from '@/types/unity'

type Props = {
  unities: Unity[]
  setData: Dispatch<SetStateAction<Unity[]>>
}

function CreateUnity({ unities, setData }: Props) {
  const [charCount, setCharCount] = useState(0)
  const [open, setOpen] = useState(false)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isLoading },
  } = useForm<z.infer<typeof UnitySchema>>({
    resolver: zodResolver(UnitySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof UnitySchema>> = async (data) => {
    const res = await create(data)

    if (res.error) {
      setError(res.error)
    }

    if (res.status === 201) {
      const { message, unity } = res.data
      toast.success(message)

      reset()
      setCharCount(0)
      setOpen(false)
      setData([unity, ...unities])
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ms-auto bg-blue-500 text-white dark:hover:bg-blue-600 cursor-pointer flex gap-2 items-center">
          <PlusIcon />
          <span>Crear unidad</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear una unidad</DialogTitle>
          <DialogDescription>Estás a punto de crear una nueva unidad</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              placeholder="Nombre de la unidad"
              maxLength={50}
            />
            {errors.name && <ErrorForm message={errors.name.message || ''} />}
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              placeholder="Escribe una breve descripción"
              id="description"
              className="field-sizing-content"
              maxLength={255}
              {...register('description', {
                onChange: (e) => {
                  setCharCount(e.target.value.length)
                  return e
                },
              })}
            />
            <p className="text-sm text-muted-foreground" id="description-count">
              {charCount}/255
            </p>
            {errors.description && <ErrorForm message={errors.description.message || ''} />}
          </div>

          {errorStatus.error && <ErrorForm message={errorStatus.message} />}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader size="sm" variant="spinner" /> : 'Guardar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUnity
