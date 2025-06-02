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
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { CategorySchema } from '@/schemas/category'
import { create } from '@/actions/categories'
import { Loader } from '@/components/ui/loader'
import { useCategoriesStore } from '@/store/categories/useCategoriesStore'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

function CreateCategory() {
  const [charCount, setCharCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const categories = useCategoriesStore((state) => state.categories)
  const setCategories = useCategoriesStore((state) => state.setCategories)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof CategorySchema>> = async (data) => {
    setIsLoading(true)
    try {
      const res = await create(data)

      if (res.error) {
        setError(res.error)
      }

      if (res.status === 201) {
        const { message, category } = res.data
        toast.success(message)

        form.reset()
        setCharCount(0)
        setIsOpen(false)
        setCategories([category, ...categories])
      }
    } catch (_error) {
      toast.error('Ocurrió un error. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ms-auto bg-blue-500 text-white dark:hover:bg-blue-600 cursor-pointer flex gap-2 items-center">
          <PlusIcon />
          <span>Crear categoría</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear una categoría</DialogTitle>
          <DialogDescription>Estás a punto de crear una nueva categoría</DialogDescription>
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

            <Button
              className={
                isLoading || !form.formState.isValid ? 'cursor-not-allowed' : 'cursor-pointer'
              }
              type="submit"
              disabled={isLoading || !form.formState.isValid}
            >
              {isLoading ? <Loader size="sm" variant="spinner" /> : 'Guardar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCategory
