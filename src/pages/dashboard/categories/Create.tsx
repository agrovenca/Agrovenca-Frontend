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
import { CategorySchema } from '@/schemas/category'
import { Loader } from '@/components/ui/loader'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import useCreateCategory from '@/hooks/categories/useCreateCategory'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { User } from '@/types/auth/user'

function CreateCategory() {
  const [charCount, setCharCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const user = useAuthStore((state) => state.user)

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const { createCategoryMutation } = useCreateCategory({ user: user as User })

  const onSubmit: SubmitHandler<z.infer<typeof CategorySchema>> = async (data) => {
    createCategoryMutation.mutate(
      { newData: data },
      {
        onSuccess: (categoryResponse) => {
          toast.success(categoryResponse.message)
          form.reset()
          setCharCount(0)
          setIsOpen(false)
        },
        onError: (err) => {
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

            {createCategoryMutation.isError && (
              <ErrorForm message={createCategoryMutation.error.message} />
            )}

            <Button
              className={
                createCategoryMutation.isPending || !form.formState.isValid
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              }
              type="submit"
              disabled={createCategoryMutation.isPending || !form.formState.isValid}
            >
              {createCategoryMutation.isPending ? (
                <Loader size="sm" variant="spinner" />
              ) : (
                'Guardar'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCategory
