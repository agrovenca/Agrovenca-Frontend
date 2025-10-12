import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InfoIcon, ListTodoIcon } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useState } from 'react'
import ErrorForm from '@/components/pages/ErrorForm'
import { Loader } from '@/components/ui/loader'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { OrderAdminUpdateSchema } from '@/schemas/orders'
import { Order, OrderStatusLabels, PaymentStatus, PaymentStatusLabels } from '@/types/order'
import useUpdateAdminOrder from '@/hooks/orders/useAdminUpdateOrder'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertTitle } from '@/components/ui/alert'

interface Props {
  order: Order
}

function OrderUpdateStatusPage({ order }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const initialData = {
    orderStatus: order.status,
    paymentStatus: order.payment?.status || PaymentStatus.UNPAID,
  }

  const form = useForm<z.infer<typeof OrderAdminUpdateSchema>>({
    resolver: zodResolver(OrderAdminUpdateSchema),
    defaultValues: initialData,
  })

  const { updateAdminOrderMutation } = useUpdateAdminOrder()

  const onSubmit: SubmitHandler<z.infer<typeof OrderAdminUpdateSchema>> = async (newData) => {
    setIsOpen(false)
    updateAdminOrderMutation.mutate(
      { id: order.id, newData },
      {
        onSuccess: ({ message }) => {
          toast.success(message)
          form.reset()
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
        <Button size={'icon'} variant={'ghost'} className="cursor-pointer text-blue-500">
          <ListTodoIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar estado de la orden</DialogTitle>
          <DialogDescription>Estás a punto de actualizar el estado de esta orden</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="orderStatus"
              render={({ field }) => (
                <FormItem className="w-full flex-1">
                  <FormLabel htmlFor="orderStatus">Estado de la órden</FormLabel>
                  <FormControl id="orderStatus">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="orderStatus" className="w-full">
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(OrderStatusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            {order.payment ? (
              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel htmlFor="paymentStatus">Estado del pago</FormLabel>
                    <FormControl id="paymentStatus">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="paymentStatus" className="w-full">
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PaymentStatusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <Alert>
                <InfoIcon />
                <AlertTitle>No hay información de pago para esta orden.</AlertTitle>
              </Alert>
            )}

            {updateAdminOrderMutation.isError && (
              <ErrorForm message={updateAdminOrderMutation.error.message} />
            )}

            <div className="flex items-center gap-2 justify-end">
              <Button
                type="button"
                variant={'secondary'}
                className="flex-1 font-serif uppercase"
                onClick={() => form.reset({ ...initialData })}
              >
                Restablecer
              </Button>
              <Button
                className={
                  'flex-1 font-serif uppercase ' +
                  (updateAdminOrderMutation.isPending || !form.formState.isValid
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer')
                }
                type="submit"
                disabled={updateAdminOrderMutation.isPending || !form.formState.isValid}
              >
                {updateAdminOrderMutation.isPending ? (
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

export default OrderUpdateStatusPage
