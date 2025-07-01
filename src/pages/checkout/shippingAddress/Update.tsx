import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import { Textarea } from '@/components/ui/textarea'
import ErrorForm from '@/components/pages/ErrorForm'
import { EditIcon } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'
import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { ShippingAddress } from '@/types/shippingAddress'
import {
  AddressUpdateSchema,
  CountryStates,
  type Country,
} from '@/schemas/products/shippingAddress'
import { updateAddress } from '@/actions/shippingData'
import { useShippingAddressStore } from '@/store/shippingAddresses/useAddressesStore'

type Props = {
  address: ShippingAddress
}

function Update({ address }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [charCount, setCharCount] = useState(address.address_line_1?.length || 0)

  const updateAddressStore = useShippingAddressStore((state) => state.updateAddress)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)

  const form = useForm<z.infer<typeof AddressUpdateSchema>>({
    resolver: zodResolver(AddressUpdateSchema),
    defaultValues: { ...address, country: address.country as Country },
  })

  const country = form.watch('country') as Country
  const stateOptions = country ? [...CountryStates[country]] : []

  const onReset = useCallback(() => {
    form.reset({ ...address, country: address.country as Country, state: address.state || '' })
    setCharCount(address.address_line_1?.length || 0)
  }, [address, form])

  const onSubmit: SubmitHandler<z.infer<typeof AddressUpdateSchema>> = async (data) => {
    setIsLoading(true)
    try {
      const res = await updateAddress({ pk: address.pk, data })

      if (res.error) {
        setError(res.error)
      }

      if (res.status === 200) {
        const { message, address: updatedAddress } = res.data
        toast.success(message)

        updateAddressStore(updatedAddress)
        onReset()
        setCharCount(0)
        setIsOpen(false)
      }
    } catch (_error) {
      toast.error('Ocurrió un error. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      onReset()
      setCharCount(address.address_line_1?.length || 0)
    }
  }, [isOpen, address, form, onReset])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer text-blue-500">
          <EditIcon className="w-5 h-5" />
          <span>Editar</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar una dirección de envío</DialogTitle>
          <DialogDescription>Estás a punto de actualizar esta dirección de envío</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
            id={`updateForm-${address.pk}`}
          >
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alias *</FormLabel>
                  <Input
                    id="alias"
                    type="text"
                    maxLength={50}
                    className="font-serif"
                    placeholder="ej. Casa, Oficina, etc."
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <Input
                      id="name"
                      type="text"
                      maxLength={150}
                      className="font-serif"
                      placeholder="Nombre(s) del destinatario"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido *</FormLabel>
                    <Input
                      id="lastName"
                      type="text"
                      maxLength={150}
                      className="font-serif"
                      placeholder="Apellido(s) del destinatario"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico *</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    className="font-serif"
                    placeholder="Correo electrónico del destinatario"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de teléfono *</FormLabel>
                  <Input
                    id="phone"
                    type="text"
                    className="font-serif"
                    placeholder="Teléfono del destinatario"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe una dirección, calles, avenidas, código postal..."
                      className="resize-none font-serif"
                      maxLength={250}
                      {...field}
                      onChange={(e) => {
                        setCharCount(e.target.value.length)
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground" id="description-count">
                    {charCount}/250
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="country">País *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl id="country">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un país" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="font-serif">
                        {Object.keys(CountryStates).map((country) => (
                          <SelectItem value={country} key={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="state">Estado/Provincia *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={!country}
                    >
                      <FormControl id="state">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="font-serif">
                        {stateOptions.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad *</FormLabel>
                    <Input
                      id="city"
                      type="text"
                      className="font-serif"
                      placeholder="Ciudad"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {errorStatus.error && <ErrorForm message={errorStatus.message} />}

            <div className="flex items-center gap-2 justify-end">
              <Button
                type="reset"
                variant={'secondary'}
                disabled={isLoading}
                className="cursor-pointer"
                onClick={onReset}
              >
                Restablecer
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                form={`updateForm-${address.pk}`}
                className={
                  isLoading || !form.formState.isValid ? 'cursor-not-allowed' : 'cursor-pointer'
                }
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

export default Update
