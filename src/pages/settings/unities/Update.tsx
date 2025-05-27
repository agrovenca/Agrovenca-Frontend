import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { EditIcon } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import ErrorForm from '@/components/pages/ErrorForm'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { UnitySchema } from '@/schemas/unity'
import { Unity } from '@/types/unity'
import { Loader } from '@/components/ui/loader'
import { update } from '@/actions/settings/unities'
import { useUnitiesStore } from '@/store/dashboard/useUnitiesStore'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

type Props = {
  unity: Unity
}

function Update({ unity }: Props) {
  const [charCount, setCharCount] = useState(unity.description?.length || 0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const updateUnity = useUnitiesStore((state) => state.updateUnity)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)

  const form = useForm<z.infer<typeof UnitySchema>>({
    resolver: zodResolver(UnitySchema),
    defaultValues: {
      name: unity.name,
      description: unity.description,
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof UnitySchema>> = async (data) => {
    setIsLoading(true)
    try {
      const res = await update(unity.id, data)

      if (res.error) {
        setError(res.error)
      }

      if (res.status === 200) {
        const { message, unity: updatedUnity } = res.data
        toast.success(message)

        form.reset()
        setCharCount(0)
        setIsOpen(false)
        updateUnity(updatedUnity)
      }
    } catch (_error) {
      toast.error('Ocurrió un error. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      form.reset({ ...unity })
      setCharCount(unity.description?.length || 0)
    }
  }, [isOpen, unity, form])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'icon'} variant={'ghost'} className="cursor-pointer text-blue-500">
          <EditIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar una unidad</DialogTitle>
          <DialogDescription>Estás a punto de actualizar esta unidad</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Nombre</FormLabel>
                  <Input
                    id="name"
                    type="text"
                    maxLength={50}
                    placeholder="Nombre de la categoría"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe una breve descripción"
                      className="resize-none"
                      maxLength={255}
                      {...field}
                      onChange={(e) => {
                        setCharCount(e.target.value.length)
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground" id="description-count">
                    {charCount}/255
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorStatus.error && <ErrorForm message={errorStatus.message} />}

            <div className="flex items-center gap-2 justify-end">
              <Button type="button" variant={'secondary'} onClick={() => form.reset({ ...unity })}>
                Restablecer
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader size="sm" variant="spinner" /> : 'Guardar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default Update
