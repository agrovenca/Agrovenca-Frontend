import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ImagesIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useState } from 'react'
import ErrorForm from '@/components/pages/ErrorForm'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { ProductImageSchema } from '@/schemas/products/images'
import { create } from '@/actions/settings/products/images'
import { Loader } from '@/components/ui/loader'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useProductsStore } from '@/store/dashboard/useProductsStore'

function RegisterProductImage({ productId }: { productId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const products = useProductsStore((state) => state.products)
  const setProducts = useProductsStore((state) => state.setProducts)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)

  const form = useForm<z.infer<typeof ProductImageSchema>>({
    resolver: zodResolver(ProductImageSchema),
    defaultValues: {
      files: [],
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof ProductImageSchema>> = async (data) => {
    setIsLoading(true)
    try {
      const res = await create(productId, data)

      if (res.error) {
        setError(res.error)
      }

      if (res.status === 201) {
        const { message, image } = res.data
        toast.success(message)

        form.reset()
        setIsOpen(false)
        // setProducts(
        //   products.filter((product) =>
        //     product.id === image.productId ? product.images.push(image) : product
        //   )
        // )
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
        <Button variant={'ghost'} size={'icon'} title="Imágenes del producto">
          <ImagesIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar imágen(es) de producto</DialogTitle>
          <DialogDescription>
            Estás a punto de registrar nueva(s) para este producto
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
            encType="multipart/form-data"
          >
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="files">Cargar Imágen(es)</FormLabel>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    placeholder="Selecciona las imágenes para este producto"
                    onChange={(e) => field.onChange(Array.from(e.target.files ?? []))}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
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

export default RegisterProductImage
