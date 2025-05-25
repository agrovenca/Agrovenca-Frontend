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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import ErrorForm from '@/components/pages/ErrorForm'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { CategorySchema } from '@/schemas/category'
import { Category } from '@/types/category'
import { Loader } from '@/components/ui/loader'
import { update } from '@/actions/settings/categories'
import { useCategoryStore } from '@/store/dashboard/useCategoriesStore'

type Props = {
  category: Category
}

function Update({ category }: Props) {
  const [charCount, setCharCount] = useState(category.description?.length || 0)
  const [open, setOpen] = useState(false)
  const categories = useCategoryStore((state) => state.categories)
  const setCategories = useCategoryStore((state) => state.setCategories)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isLoading },
  } = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: category.name,
      description: category.description,
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof CategorySchema>> = async (data) => {
    const res = await update(category.id, data)

    if (res.error) {
      setError(res.error)
    }

    if (res.status === 200) {
      const { message, category: updatedCategory } = res.data
      toast.success(message)

      reset()
      setCharCount(0)
      setOpen(false)

      const newData = categories.map((cat) =>
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
      setCategories(newData)
    }
  }

  useEffect(() => {
    if (open) {
      reset({
        name: category.name,
        description: category.description,
      })
      setCharCount(category.description?.length || 0)
    }
  }, [open, category, reset])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              placeholder="Nombre de la categoría"
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

export default Update
