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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { BoldIcon, ItalicIcon, ListIcon, PlusIcon } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useState } from 'react'
import ErrorForm from '@/components/pages/ErrorForm'
import { ProductSchema } from '@/schemas/products'
import { Loader } from '@/components/ui/loader'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import useCategories from '@/hooks/categories/useCategories'
import useUnities from '@/hooks/unities/useUnities'
import useCreateProduct from '@/hooks/products/useCreateProduct'
import Documentation from './Documentation'

function CreateProduct() {
  const [charCount, setCharCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [description, setDescription] = useState('')

  const { createProductMutation } = useCreateProduct()
  const { categoriesQuery } = useCategories()
  const { unitiesQuery } = useUnities()

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      secondPrice: 0,
      stock: 1,
      freeShipping: true,
      videoId: '',
      categoryId: '',
      unityId: '',
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof ProductSchema>> = async (newData) => {
    setIsOpen(false)
    createProductMutation.mutate(
      { newData },
      {
        onSuccess: ({ message }) => {
          toast.success(message)
          form.reset()
          setCharCount(0)
          setDescription('')
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2 bg-primary">
          <PlusIcon />
          <span>Crear</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Crear un nuevo producto</SheetTitle>
          <SheetDescription className="font-serif">
            Completa el formulario para crear un nuevo producto. Asegúrate de que todos los campos
            sean válidos antes de enviar.
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
                          onClick={() => handleFormat({ format: 'bold', text: field.value })}
                        >
                          <BoldIcon />
                        </Button>
                        <Button
                          type="button"
                          size={'icon'}
                          variant={'outline'}
                          title="Insertar cursiva"
                          className="cursor-pointer"
                          onClick={() => handleFormat({ format: 'italic', text: field.value })}
                        >
                          <ItalicIcon />
                        </Button>
                        <Button
                          type="button"
                          size={'icon'}
                          variant={'outline'}
                          title="Insertar lista"
                          className="cursor-pointer"
                          onClick={() => handleFormat({ format: 'list', text: field.value })}
                        >
                          <ListIcon />
                        </Button>
                      </div>
                      <FormControl className="rounded-none rounded-b-lg">
                        <Textarea
                          placeholder="Escribe una breve descripción"
                          className="resize-none"
                          maxLength={900}
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
                      {charCount}/900
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

              {createProductMutation.isError && (
                <ErrorForm message={createProductMutation.error.message} />
              )}

              <Button
                type="submit"
                disabled={createProductMutation.isPending || !form.formState.isValid}
                className={`${
                  createProductMutation.isPending || !form.formState.isValid
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                } w-full uppercase`}
              >
                {createProductMutation.isPending ? <Loader size="sm" variant="spinner" /> : 'Crear'}
              </Button>
            </form>
          </Form>
          <Separator />
          <Documentation />
        </section>
      </SheetContent>
    </Sheet>
  )
}

export default CreateProduct
