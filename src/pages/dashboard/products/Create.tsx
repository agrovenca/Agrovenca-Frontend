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
import { useEffect, useState } from 'react'
import ErrorForm from '@/components/pages/ErrorForm'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { ProductSchema } from '@/schemas/products'
import { Loader } from '@/components/ui/loader'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { create } from '@/actions/products'
import { useProductsStore } from '@/store/products/useProductsStore'
import { useCategoriesStore } from '@/store/categories/useCategoriesStore'
import { useUnitiesStore } from '@/store/unities/useUnitiesStore'
import { useAuthStore } from '@/store/auth/useAuthStore'

function CreateProduct() {
  const [charCount, setCharCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [description, setDescription] = useState('')

  const user = useAuthStore((state) => state.user)
  const products = useProductsStore((state) => state.products)
  const setUserId = useProductsStore((state) => state.setUserId)
  const setProducts = useProductsStore((state) => state.setProducts)
  const categories = useCategoriesStore((state) => state.categories)
  const unities = useUnitiesStore((state) => state.unities)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)

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

  const onSubmit: SubmitHandler<z.infer<typeof ProductSchema>> = async (data) => {
    setIsLoading(true)
    try {
      const res = await create(data)

      if (res.error) {
        setError(res.error)
      }

      if (res.status === 201) {
        const { message, product } = res.data
        toast.success(message)

        setCharCount(0)
        form.reset()
        setIsOpen(false)
        setProducts([...products, product])
      }
    } catch (_error) {
      toast.error('Ocurrió un error. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
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
    if (user) setUserId(user.id)
  }, [setUserId, user])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2 bg-yellow-400 text-black hover:text-white">
          <PlusIcon />
          <span>Crear</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Crear un nuevo producto</SheetTitle>
          <SheetDescription>
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
                      <Input id="videoId" type="text" placeholder="" {...field} />
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
                        {categories.length <= 0 ? (
                          <SelectItem value="" disabled>
                            No existen categorías
                          </SelectItem>
                        ) : (
                          categories.map((category) => (
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
                        {unities.length <= 0 ? (
                          <SelectItem value="" disabled>
                            No existen unidades
                          </SelectItem>
                        ) : (
                          unities.map((unity) => (
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

              {errorStatus.error && <ErrorForm message={errorStatus.message} />}

              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                className={`${
                  isLoading || !form.formState.isValid ? 'cursor-not-allowed' : 'cursor-pointer'
                } w-full uppercase`}
              >
                {isLoading ? <Loader size="sm" variant="spinner" /> : 'Crear'}
              </Button>
            </form>
          </Form>
          <Separator />
          <section className="flex flex-col gap-2">
            <div className="p-4 bg-slate-100 dark:bg-gray-800 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4 font-sans">Id de video</h3>
              <p className="mb-2">
                El id de video es el que aparece en la url del video de youtube.
              </p>
              <div>
                <p className="text-sm text-muted-foreground">
                  Por ejemplo, si la url del video es:{' '}
                </p>
                <p className="italic text-blue-400">https://www.youtube.com/watch?v=1234567890</p>
                entonces el id de video es <span className="font-bold">1234567890</span>.
              </div>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-gray-800 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4 font-sans">Segundo precio</h3>
              <p className="mb-2">
                El segundo precio es un precio opcional que puedes usar para mostrar un precio
                diferente al precio normal.
              </p>
              <div>
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

export default CreateProduct
