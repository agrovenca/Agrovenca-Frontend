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
import { ProductImageSchema } from '@/schemas/products/images'
import { Loader } from '@/components/ui/loader'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ProductImage } from '@/types/product/images'
import useCreateProductImage from '@/hooks/products/images/useCreateProductImage'
import { Product } from '@/types/product'

function RegisterProductImage({
  product,
  setNewImages,
}: {
  product: Product
  setNewImages?: (newImages: ProductImage[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { createProductImageMutation } = useCreateProductImage({
    product: product,
  })

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

  const onSubmit: SubmitHandler<z.infer<typeof ProductImageSchema>> = async (newImages) => {
    setIsOpen(false)
    createProductImageMutation.mutate(
      { productId: product.id, newImages },
      {
        onSuccess: ({ images, message }) => {
          toast.success(message)
          form.reset()
          setSelectedFiles([])
          setNewImages?.(images)
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

            {createProductImageMutation.isError && (
              <ErrorForm message={createProductImageMutation.error.message} />
            )}

            <div className="flex items-center justify-between gap-2">
              <span>
                <span>{selectedFiles.length}</span> imágenes seleccionadas
              </span>
              <Button
                className={
                  createProductImageMutation.isPending || !form.formState.isValid
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                }
                type="submit"
                disabled={createProductImageMutation.isPending || !form.formState.isValid}
              >
                {createProductImageMutation.isPending ? (
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

export default RegisterProductImage
