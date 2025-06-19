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
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Country, CountryStates, ShippingAddressSchema } from '@/schemas/products/shippingAddress'
import z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { useShippindAddressStore } from '@/store/shippingAddresses'

function FormCreate() {
  const [charCount, setCharCount] = useState(0)
  const user = useAuthStore((state) => state.user)
  const addAddress = useShippindAddressStore((state) => state.addAddress)

  const form = useForm<z.infer<typeof ShippingAddressSchema>>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: {
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

  const onSubmit: SubmitHandler<z.infer<typeof ShippingAddressSchema>> = (data) => {
    if (!user) {
      addAddress({
        ...data,
        pk: crypto.randomUUID(),
        alias: '',
        userId: '',
        isDefault: false,
        createdAt: new Date().toISOString(),
      })
      return
    }
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          disabled={!form.formState.isValid}
          type="submit"
          className="bg-blue-500 dark:hover:bg-blue-600 text-white font-serif ml-auto cursor-pointer"
        >
          Guardar datos
        </Button>
      </form>
    </Form>
  )
}

export default FormCreate
