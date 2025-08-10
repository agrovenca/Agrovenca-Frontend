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
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useState } from 'react'
import ErrorForm from '@/components/pages/ErrorForm'
import { UnitySchema } from '@/schemas/unity'
import { Loader } from '@/components/ui/loader'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import useCreateUnity from '@/hooks/unities/useCreateUnity'

function CreateUnity() {
  const [charCount, setCharCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const { createUnityMutation } = useCreateUnity()

  const form = useForm<z.infer<typeof UnitySchema>>({
    resolver: zodResolver(UnitySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof UnitySchema>> = async (data) => {
    setIsOpen(false)
    createUnityMutation.mutate(
      { newData: data },
      {
        onSuccess: ({ message }) => {
          toast.success(message)
          form.reset()
          setCharCount(0)
        },
        onError: (err) => {
          setIsOpen(true)
          const errorMsg = () => {
            if (err instanceof Error) return err.message
            return 'Ocurrió un error. Por favor intenta de nuevo.'
          }
          toast.error(errorMsg())
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ms-auto bg-primary cursor-pointer flex gap-2 items-center">
          <PlusIcon />
          <span>Crear unidad</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear una unidad</DialogTitle>
          <DialogDescription>Estás a punto de crear una nueva unidad</DialogDescription>
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
                    placeholder="Nombre de la unidad"
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

            {createUnityMutation.isError && (
              <ErrorForm message={createUnityMutation.error.message} />
            )}

            <Button
              type="submit"
              className={
                'w-full uppercase font-serif ' +
                (createUnityMutation.isPending || !form.formState.isValid
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer')
              }
              disabled={createUnityMutation.isPending || !form.formState.isValid}
            >
              {createUnityMutation.isPending ? <Loader size="sm" variant="spinner" /> : 'Guardar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUnity
