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
import { CategorySchema } from '@/schemas/category'
import { Category } from '@/types/category'
import { Loader } from '@/components/ui/loader'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import useUpdateCategory from '@/hooks/categories/useUpdateCategory'

type Props = {
  category: Category
}

function Update({ category }: Props) {
  const [charCount, setCharCount] = useState(category.description?.length || 0)
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: { ...category },
  })

  const { updateCategoryMutation } = useUpdateCategory()

  const onSubmit: SubmitHandler<z.infer<typeof CategorySchema>> = async (data) => {
    updateCategoryMutation.mutate(
      { id: category.id, newData: data },
      {
        onSuccess: (_data) => {
          toast.success('Categoría actualizada')
          form.reset()
          setCharCount(0)
          setIsOpen(false)
        },
        onError: (_error) => {
          toast.error('Ocurrió un error. Por favor intenta de nuevo.')
        },
      }
    )
  }

  useEffect(() => {
    if (isOpen) {
      form.reset({ ...category })
      setCharCount(category.description?.length || 0)
    }
  }, [isOpen, category, form])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'icon'} variant={'ghost'} className="cursor-pointer text-blue-500">
          <EditIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar una categoría</DialogTitle>
          <DialogDescription>Estás a punto de actualizar esta categoría</DialogDescription>
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
                  <FormLabel>Descripción</FormLabel>
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

            {updateCategoryMutation.isError && (
              <ErrorForm message={updateCategoryMutation.error.message} />
            )}

            <div className="flex items-center gap-2 justify-end">
              <Button
                type="button"
                variant={'secondary'}
                onClick={() => form.reset({ ...category })}
              >
                Restablecer
              </Button>
              <Button
                className={
                  updateCategoryMutation.isPending || !form.formState.isValid
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                }
                type="submit"
                disabled={updateCategoryMutation.isPending || !form.formState.isValid}
              >
                {updateCategoryMutation.isPending ? (
                  <Loader size="sm" variant="spinner" />
                ) : (
                  'Guardar'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default Update
