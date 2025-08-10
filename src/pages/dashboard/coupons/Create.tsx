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
import { useState } from 'react'
import ErrorForm from '@/components/pages/ErrorForm'
import { CouponCreateSchema } from '@/schemas/coupons'
import { CouponTypes } from '@/types/coupon'
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
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import useCategories from '@/hooks/categories/useCategories'
import useCreateCoupon from '@/hooks/coupons/useCreateCoupon'

function CreateCoupon() {
  const [codeCount, setCodeCount] = useState(0)
  const [descriptionCount, setDescriptionCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const { categoriesQuery } = useCategories()
  const { createCouponMutation } = useCreateCoupon()

  const form = useForm<z.infer<typeof CouponCreateSchema>>({
    resolver: zodResolver(CouponCreateSchema),
    defaultValues: {
      code: '',
      description: undefined,
      discount: 0,
      active: true,
      type: CouponTypes.PERCENTAGE,
      usageLimit: 0,
      minPurchase: undefined,
      validCategories: [],
      expiresAt: undefined,
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof CouponCreateSchema>> = async (data) => {
    setIsOpen(false)
    createCouponMutation.mutate(
      { newData: data },
      {
        onSuccess: ({ message }) => {
          toast.success(message)
          form.reset()
          setCodeCount(0)
          setDescriptionCount(0)
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
        <Button className="ms-auto bg-primary cursor-pointer flex gap-2 items-center">
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
                      maxLength={50}
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
                      maxLength={255}
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
                    <FormDescription>
                      {Number(field.value) === 0 && <p className="ms-2">0 = Sin límite</p>}
                    </FormDescription>
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
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          captionLayout={'dropdown'}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h4 className="text-lg mb-0">Condiciones (opcionales)</h4>
            <div className="p-4 rounded-lg border space-y-4">
              <FormField
                control={form.control}
                name="minPurchase"
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel htmlFor="minPurchase">Monto mínimo</FormLabel>
                    <FormControl>
                      <Input
                        id="minPurchase"
                        type="number"
                        className="w-full"
                        placeholder="20, 40, 60..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      El monto mínimo que debe gastar un cliente para usar el cupón.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="validCategories"
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel>Categorías válidas</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          {field.value && field.value.length > 0
                            ? field.value
                                .map((id) => {
                                  const category = categoriesQuery.data?.find(
                                    (cat) => cat.id === id
                                  )
                                  return category ? category.name : ''
                                })
                                .join(', ')
                            : 'Selecciona categorías'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px]">
                        <div className="flex flex-col gap-2">
                          {categoriesQuery.data?.map((category) => (
                            <div key={category.id} className="flex items-center gap-2">
                              <Checkbox
                                id={category.id}
                                checked={field.value?.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...(field.value || []), category.id]
                                    : (field.value || []).filter((val) => val !== category.id)
                                  field.onChange(newValue)
                                }}
                              />
                              <label htmlFor={category.id} className="text-sm capitalize">
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                    <FormDescription>
                      Selecciona las categorías donde el cupón será válido.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {createCouponMutation.isError && (
              <ErrorForm message={createCouponMutation.error.message} />
            )}

            <Button
              type="submit"
              disabled={createCouponMutation.isPending || !form.formState.isValid}
              className={`w-full uppercase font-serif ${
                createCouponMutation.isPending || !form.formState.isValid
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >
              {createCouponMutation.isPending ? <Loader size="sm" variant="spinner" /> : 'Guardar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCoupon
