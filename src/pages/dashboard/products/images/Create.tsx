import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRef, useState } from 'react'
import ErrorForm from '@/components/pages/ErrorForm'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { ProductImageSchema } from '@/schemas/products/images'
import { create } from '@/actions/products/images'
import { Loader } from '@/components/ui/loader'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useProductsStore } from '@/store/products/useProductsStore'
import { ProductImage } from '@/types/product/images'

function RegisterProductImage({
  productId,
  onSuccess,
}: {
  productId: string
  onSuccess?: (newImages: ProductImage[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const products = useProductsStore((state) => state.products)
  const updateProduct = useProductsStore((state) => state.updateProduct)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)

  const form = useForm<z.infer<typeof ProductImageSchema>>({
    resolver: zodResolver(ProductImageSchema),
    defaultValues: {
      files: [],
    },
  })

  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files)
    form.setValue('files', files, { shouldValidate: true })
  }

  const removeImage = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updatedFiles)
    form.setValue('files', updatedFiles, { shouldValidate: true })
    if (updatedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit: SubmitHandler<z.infer<typeof ProductImageSchema>> = async (data) => {
    setIsLoading(true)
    try {
      const res = await create(productId, data)

      if (res.error) {
        setError(res.error)
      }

      if (res.status === 201) {
        const { message, images, productId: updatedProductId } = res.data
        toast.success(message)

        form.reset()
        setSelectedFiles([])
        setIsOpen(false)
        const existingProduct = products.find((p) => p.id === updatedProductId)
        if (existingProduct) {
          updateProduct({ ...existingProduct, images })
        }
        onSuccess?.(images)
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
        <Button variant={'ghost'} size={'icon'} title="Registrar imágenes al producto">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar imágenes de producto</DialogTitle>
          <DialogDescription>
            Estás a punto de registrar nuevas imágenes para este producto
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
                  <FormLabel htmlFor="files">Cargar Imágenes</FormLabel>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    accept="image/jpeg, image/jpg, image/png, image/webp"
                    placeholder="Selecciona las imágenes para este producto"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? [])
                      handleFilesChange(files)
                      return e
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={fileInputRef}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      width={200}
                      height={200}
                      className="rounded-md object-cover w-full h-[140px] border"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/50 hover:bg-black text-white rounded-full p-1 transition cursor-pointer"
                      title="Eliminar imagen"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errorStatus.error && <ErrorForm message={errorStatus.message} />}

            <div className="flex items-center justify-between gap-2">
              <span>
                <span>{selectedFiles.length}</span> imágenes seleccionadas
              </span>
              <Button
                className={
                  isLoading || !form.formState.isValid ? 'cursor-not-allowed' : 'cursor-pointer'
                }
                type="submit"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? <Loader size="sm" variant="spinner" /> : 'Guardar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default RegisterProductImage
