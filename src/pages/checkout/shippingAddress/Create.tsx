import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Country, CountryStates, ShippingAddressSchema } from '@/schemas/products/shippingAddress'
import z from 'zod'

import { useAuthStore } from '@/store/auth/useAuthStore'
import { useShippindAddressStore } from '@/store/shippingAddresses'
import { createShippingAddress } from '@/actions/shippingData'
import { Loader } from '@/components/ui/loader'

function CreateShippingAddress() {
  const [isOpen, setIsOpen] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const user = useAuthStore((state) => state.user)
  const addAddress = useShippindAddressStore((state) => state.addAddress)

  const form = useForm<z.infer<typeof ShippingAddressSchema>>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: {
      alias: '',
      name: '',
      lastName: '',
      email: '',
      phone: '',
      address_line_1: '',
      country: 'Venezuela',
      state: '',
      city: '',
    },
  })

  const country = form.watch('country') as Country
  const stateOptions = country ? [...CountryStates[country]] : []

  const onSubmit: SubmitHandler<z.infer<typeof ShippingAddressSchema>> = async (data) => {
    if (!user) {
      return
    }

    // If user is logged in, submit the form data
    setIsLoading(true)
    try {
      const res = await createShippingAddress({ data })
      if (res.status !== 201) {
        throw new Error('Failed to create shipping address')
      }
      addAddress(res.data.address)
      console.log('Shipping address created successfully:', res.data)
    } catch (error) {
      console.error('Error creating shipping address:', error)
    } finally {
      setIsLoading(false)
      form.reset()
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ms-auto bg-blue-500 text-white dark:hover:bg-blue-600 cursor-pointer flex gap-2 items-center">
          <PlusIcon />
          <span>Añadir dirección</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear una dirección de envío</DialogTitle>
          <DialogDescription>Estás a punto de crear una nueva dirección de envío</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
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
            <Button
              disabled={!form.formState.isValid || isLoading}
              type="submit"
              className="bg-blue-500 dark:hover:bg-blue-600 text-white font-serif ml-auto cursor-pointer"
            >
              {isLoading ? <Loader size="sm" variant="spinner" /> : 'Guardar datos'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateShippingAddress
