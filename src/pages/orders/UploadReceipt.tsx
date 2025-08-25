import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef, useState } from 'react'
import { OrderPaymentSchema } from '@/schemas/orders'
import { EditIcon, UploadIcon } from 'lucide-react'
import { Loader } from '@/components/ui/loader'
import useCreatePayment from '@/hooks/orders/useCreatePayment'
import { Order } from '@/types/order'
import { toast } from 'sonner'

interface Props {
  order: Order
  userId: string
}

function UploadReceipt({ order, userId }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { createPaymentMutation } = useCreatePayment({ order, userId })

  const form = useForm<z.infer<typeof OrderPaymentSchema>>({
    resolver: zodResolver(OrderPaymentSchema),
    defaultValues: {
      receipt: undefined,
    },
  })

  const handleFilesChange = (file: File) => {
    setSelectedFile(file)
    form.setValue('receipt', file, { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<z.infer<typeof OrderPaymentSchema>> = async (data) => {
    setIsOpen(false)
    createPaymentMutation.mutate(
      { orderId: order.id, newData: data, userId },
      {
        onSuccess: ({ message }) => {
          toast.success(message)
          form.reset({ receipt: undefined })
          setSelectedFile(undefined)
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
        <Button variant="outline" size="sm">
          <UploadIcon className="h-4 w-4 mr-1" />
          Subir comprobante de pago
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cargar comprobante</DialogTitle>
          <DialogDescription>Estás a punto de subir el comprobante de compra</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="receipt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="receipt"
                    className="border p-4 rounded-lg font-serif cursor-pointer"
                  >
                    Cargar comprobante
                    {selectedFile && <span className="text-blue-500">{selectedFile.name}</span>}
                  </FormLabel>
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/jpeg, image/jpg, image/png"
                    placeholder="Por favor carga el comprobante de pago"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFilesChange(file)
                        return e
                      }
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={fileInputRef}
                    className="sr-only"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedFile && (
              <div className="flex justify-center gap-4 p-4 rounded-lg border-3 border-dashed w-fit mx-auto">
                <div key={selectedFile.size} className="relative group">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt={`preview-${selectedFile.size}`}
                    width={200}
                    className="rounded-md object-cover w-full h-full border"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute top-1 right-1 bg-black/50 hover:bg-black text-white rounded-full p-1 transition cursor-pointer"
                    title="Eliminar imagen"
                  >
                    <EditIcon size={16} />
                  </button>
                </div>
              </div>
            )}

            <Button
              size={'lg'}
              className={
                'w-full uppercase font-serif ' +
                (!form.formState.isValid ? 'cursor-not-allowed' : 'cursor-pointer')
              }
              type="submit"
              disabled={!form.formState.isValid}
            >
              {form.formState.isLoading ? <Loader size="sm" variant="spinner" /> : 'Guardar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UploadReceipt
