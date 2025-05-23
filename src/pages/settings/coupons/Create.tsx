import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { PlusIcon, Calendar as CalendarIcon } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dispatch, SetStateAction, useState } from 'react'
import ErrorForm from '@/components/pages/ErrorForm'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { CouponSchema } from '@/schemas/coupons'
import { create } from '@/actions/settings/coupons'
import { CouponType, CouponTypes } from '@/types/coupon'
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
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

type Props = {
  coupons: CouponType[]
  setData: Dispatch<SetStateAction<CouponType[]>>
}

function CreateCoupon({ coupons, setData }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [codeCount, setCodeCount] = useState(0)
  const [descriptionCount, setDescriptionCount] = useState(0)
  const [open, setOpen] = useState(false)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)

  const form = useForm<z.infer<typeof CouponSchema>>({
    resolver: zodResolver(CouponSchema),
    defaultValues: {
      code: '',
      description: undefined,
      discount: 0,
      active: true,
      type: CouponTypes.PERCENTAGE,
      usageLimit: 0,
      expiresAt: undefined,
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof CouponSchema>> = async (data) => {
    setIsLoading(true)
    const res = await create(data)

    if (res.error) {
      setIsLoading(false)
      setError(res.error)
    }

    if (res.status === 201) {
      const { message, newObject } = res.data
      toast.success(message)
      setIsLoading(false)

      form.reset()
      setCodeCount(0)
      setDescriptionCount(0)
      setOpen(false)
      setData([newObject, ...coupons])
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ms-auto bg-blue-500 text-white dark:hover:bg-blue-600 cursor-pointer flex gap-2 items-center">
          <PlusIcon />
          <span>Crear cupón</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear un cupón</DialogTitle>
          <DialogDescription>Estás a punto de crear un nuevo cupón de descuento</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="code">Código</FormLabel>
                  <FormControl>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Código del cupón"
                      {...field}
                      onChange={(e) => {
                        setCodeCount(e.target.value.length)
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormDescription>{codeCount}/50</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe una breve descripción"
                      id="description"
                      className="field-sizing-content"
                      {...field}
                      onChange={(e) => {
                        setDescriptionCount(e.target.value.length)
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormDescription>{descriptionCount}/255</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-start gap-4 flex-col md:flex-row md:gap-0">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel htmlFor="type">Tipo</FormLabel>
                    <FormControl id="type">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger
                          id="type"
                          className="w-full md:rounded-none md:rounded-tl-md md:rounded-bl-md"
                        >
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERCENTAGE">% Porcentaje</SelectItem>
                          <SelectItem value="FIXED">$ Fijo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel htmlFor="discount">Descuento</FormLabel>
                    <FormControl>
                      <Input
                        id="discount"
                        type="number"
                        step={0.1}
                        {...field}
                        placeholder="Descuento en $ o %"
                        className="md:rounded-none md:rounded-tr-md md:rounded-br-md"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Estado</FormLabel>
                    <FormDescription></FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex items-start gap-4 flex-col md:flex-row md:gap-0">
              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel htmlFor="usageLimit">Límite de uso</FormLabel>
                    <FormControl>
                      <Input
                        id="usageLimit"
                        type="number"
                        className="w-full md:rounded-none md:rounded-tl-md md:rounded-bl-md"
                        placeholder="25, 50, 100..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full flex-1">
                    <FormLabel>Fecha de expiración</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal md:rounded-none md:rounded-tr-md md:rounded-br-md',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span>Escoge un fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {errorStatus.error && <ErrorForm message={errorStatus.message} />}

            <Button
              type="submit"
              disabled={isLoading || !form.formState.isValid}
              className={`${
                isLoading || !form.formState.isValid ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {isLoading ? <Loader size="sm" variant="spinner" /> : 'Guardar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCoupon
