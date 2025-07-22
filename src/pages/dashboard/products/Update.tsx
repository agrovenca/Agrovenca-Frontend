import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { BoldIcon, EditIcon, ItalicIcon, ListIcon } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import ErrorForm from '@/components/pages/ErrorForm'
import { ProductUpdateSchema } from '@/schemas/products'
import { Product } from '@/types/product'
import { Loader } from '@/components/ui/loader'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import useCategories from '@/hooks/categories/useCategories'
import useUnities from '@/hooks/unities/useUnities'
import useUpdateProduct from '@/hooks/products/useUpdateProduct'

type Props = {
  page: number
  product: Product
}

function UpdateProduct({ page, product }: Props) {
  const [charCount, setCharCount] = useState(product.description.length)
  const [description, setDescription] = useState(product.description)
  const [isOpen, setIsOpen] = useState(false)

  const { updateProductMutation } = useUpdateProduct({ page })
  const { categoriesQuery } = useCategories()
  const { unitiesQuery } = useUnities()

  const form = useForm<z.infer<typeof ProductUpdateSchema>>({
    resolver: zodResolver(ProductUpdateSchema),
    defaultValues: { ...product },
  })

  const onSubmit: SubmitHandler<z.infer<typeof ProductUpdateSchema>> = async (newData) => {
    setIsOpen(false)
    updateProductMutation.mutate(
      { id: product.id, newData },
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

  const handleFormat = ({ format, text }: { format: 'bold' | 'italic' | 'list'; text: string }) => {
    if (format === 'bold') {
      text += ' *bold*'
    }
    if (format === 'italic') {
      text += ' _cursive_'
    }
    if (format === 'list') {
      text += '\n- list'
    }
    setDescription(text)
    setCharCount(text.length)
  }

  useEffect(() => {
    if (isOpen) {
      form.reset({ ...product })
      setCharCount(product.description?.length || 0)
    }
  }, [isOpen, product, form])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant={'ghost'} size={'icon'} className="text-blue-500" title="Editar producto">
          <EditIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Actualizar producto</SheetTitle>
          <SheetDescription className="font-serif">
            Actualiza la información del producto. Puedes cambiar el nombre, descripción, precio,
            stock, unidad y categoría.
          </SheetDescription>
        </SheetHeader>
        <section className="p-4 space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Nombre</FormLabel>
                    <Input id="name" type="text" maxLength={255} placeholder="" {...field} />
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
                    <div className="flex flex-col">
                      <div className="p-2 rounded-t-lg border flex gap-2">
                        <Button
                          type="button"
                          size={'icon'}
                          variant={'outline'}
                          title="Insertar negrita"
                          className="cursor-pointer"
                          onClick={() => handleFormat({ format: 'bold', text: field.value ?? '' })}
                        >
                          <BoldIcon />
                        </Button>
                        <Button
                          type="button"
                          size={'icon'}
                          variant={'outline'}
                          title="Insertar cursiva"
                          className="cursor-pointer"
                          onClick={() =>
                            handleFormat({ format: 'italic', text: field.value ?? '' })
                          }
                        >
                          <ItalicIcon />
                        </Button>
                        <Button
                          type="button"
                          size={'icon'}
                          variant={'outline'}
                          title="Insertar lista"
                          className="cursor-pointer"
                          onClick={() => handleFormat({ format: 'list', text: field.value ?? '' })}
                        >
                          <ListIcon />
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Escribe una breve descripción"
                          className="resize-none"
                          maxLength={800}
                          {...field}
                          value={description}
                          onChange={(e) => {
                            setCharCount(e.target.value.length)
                            setDescription(e.target.value)
                            field.onChange(e)
                          }}
                        />
                      </FormControl>
                    </div>
                    <p className="text-sm text-muted-foreground" id="description-count">
                      {charCount}/800
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 flex-wrap items-start justify-between">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel htmlFor="price">Precio</FormLabel>
                      <Input id="price" type="number" placeholder="" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondPrice"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel htmlFor="secondPrice">Segundo precio (opcional)</FormLabel>
                      <Input id="secondPrice" type="number" placeholder="" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 flex-wrap items-start justify-between">
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel htmlFor="stock">Stock</FormLabel>
                      <Input id="stock" type="number" placeholder="" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="videoId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel htmlFor="videoId">ID de video (opcional)</FormLabel>
                      <Input
                        id="videoId"
                        type="text"
                        placeholder=""
                        {...{ ...field, value: field.value || undefined }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="categoryId">Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl id="categoryId">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!categoriesQuery.data || !categoriesQuery.data.length ? (
                          <SelectItem value="null" disabled>
                            No existen categorías
                          </SelectItem>
                        ) : (
                          categoriesQuery.data.map((category) => (
                            <SelectItem value={category.id} key={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unityId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="unityId">Unidad</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl id="unityId">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!unitiesQuery.data || !unitiesQuery.data.length ? (
                          <SelectItem value="null" disabled>
                            No existen unidades
                          </SelectItem>
                        ) : (
                          unitiesQuery.data.map((unity) => (
                            <SelectItem value={unity.id} key={unity.id}>
                              {unity.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="freeShipping"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Envío gratis</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {updateProductMutation.isError && (
                <ErrorForm message={updateProductMutation.error.message} />
              )}

              <div className="flex flex-col items-center gap-2 justify-end">
                <Button
                  type="button"
                  variant={'secondary'}
                  onClick={() => form.reset({ ...product })}
                  className="w-full uppercase"
                >
                  Restablecer
                </Button>
                <Button
                  type="submit"
                  disabled={updateProductMutation.isPending}
                  className={`${
                    updateProductMutation.isPending || !form.formState.isValid
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer'
                  } w-full uppercase`}
                >
                  {updateProductMutation.isPending ? (
                    <Loader size="sm" variant="spinner" />
                  ) : (
                    'Actualizar'
                  )}
                </Button>
                {form.formState.isValid ? 'valid' : 'invalid'}
              </div>
            </form>
          </Form>
          <Separator />
          <section className="flex flex-col gap-2">
            <div className="p-4 bg-slate-100 dark:bg-gray-800 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4 font-sans">Id de video</h3>
              <p className="mb-2 font-serif">
                El id de video es el que aparece en la url del video de youtube.
              </p>
              <div className="font-serif">
                <p className="text-sm text-muted-foreground">
                  Por ejemplo, si la url del video es:{' '}
                </p>
                <p className="italic text-blue-400">https://www.youtube.com/watch?v=1234567890</p>
                entonces el id de video es <span className="font-bold">1234567890</span>.
              </div>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-gray-800 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4 font-sans">Segundo precio</h3>
              <p className="mb-2 font-serif">
                El segundo precio es un precio opcional que puedes usar para mostrar un precio
                diferente al precio normal.
              </p>
              <div className="font-serif">
                <p className="text-sm text-muted-foreground">
                  Por ejemplo, si el precio es <span className="font-semibold">10.00</span> y el
                  segundo precio es <span className="font-semibold">5.00</span>, el usuario verá el
                  precio del producto de esta forma:
                </p>
                <p>
                  <span className="font-bold text-red-500">5.00</span>{' '}
                  <span className="line-through text-muted-foreground">10.00</span>
                </p>
              </div>
            </div>
          </section>
        </section>
      </SheetContent>
    </Sheet>
  )
}

export default UpdateProduct
