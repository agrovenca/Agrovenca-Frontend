import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import useShippingAddresses from '@/hooks/shipping/useShippingAddresses'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { useShippingAddressStore } from '@/store/shippingAddresses/useAddressesStore'
import { type ShippingAddress } from '@/types/shippingAddress'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import CreateShippingAddress from './Create'
import Update from './Update'
import DeleteAddress from './Delete'

function ListAddresses({ addresses }: { addresses: ShippingAddress[] }) {
  const selectedAddress = useShippingAddressStore((state) => state.selectedAddress)
  const setSelectedAddress = useShippingAddressStore((state) => state.setSelectedAddress)

  const addressesPk = addresses.map((address) => address.pk)
  const getAddressByPk = (pk: string) => addresses.find((address) => address.pk === pk)

  const FormSchema = z.object({
    address: z.string().refine((val) => addressesPk.includes(val), {
      message: 'You need to select a valid notification type.',
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: selectedAddress,
    },
  })

  const onReset = () => {
    setSelectedAddress(undefined)
    form.reset({ address: '' })
  }

  return (
    <Form {...form}>
      <form className="flex gap-2 justify-evenly" id="selectAddressForm">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                Enviar productos a{' '}
                <span className="font-bold">{getAddressByPk(field.value)?.alias}</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  defaultValue={field.value}
                  onValueChange={(val) => {
                    setSelectedAddress(val)
                    toast.success(`Dirección de envío seleccionada: ${getAddressByPk(val)?.alias}`)
                    field.onChange(val)
                  }}
                  className="flex gap-2 justify-evenly flex-wrap"
                >
                  {addresses.length &&
                    addresses.map((address) => (
                      <FormItem
                        className="flex flex-col max-w-sm w-full items-start gap-3 border p-4 mb-4 rounded-lg transition hover:scale-[1.01] font-serif"
                        key={address.pk}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <FormControl>
                            <RadioGroupItem value={address.pk} className="cursor-pointer" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            <div className="space-y-2">
                              <h3 className="font-sans font-bold text-[1.1rem]">{address.alias}</h3>
                              <p className="font-semibold">
                                {address.name} {address.lastName}
                              </p>
                              <p>{address.email}</p>
                              <p>{address.phone}</p>
                              <p className="italic text-wrap">{address.address_line_1}</p>
                              <p>
                                {address.city}, {address.state}, {address.country}
                              </p>
                            </div>
                          </FormLabel>
                        </div>
                      </FormItem>
                    ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
              {field.value && (
                <div className="flex gap-2">
                  <Button
                    type="reset"
                    className="flex-1 uppercase"
                    variant={'outline'}
                    disabled={!field.value}
                    onClick={() => onReset()}
                  >
                    Limpiar selección
                  </Button>
                </div>
              )}
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

function ShippingAddress() {
  const user = useAuthStore((state) => state.user)
  const selectedAddress = useShippingAddressStore((state) => state.selectedAddress)
  const [address, setAddress] = useState<ShippingAddress | null>(null)

  const { shippingAddressesQuery } = useShippingAddresses({ userId: user?.id ?? '' })

  useEffect(() => {
    if (!shippingAddressesQuery.data?.length) return
    setAddress(
      shippingAddressesQuery.data.find((address) => address.pk === selectedAddress) || null
    )
  }, [shippingAddressesQuery, selectedAddress])

  if (!user) return <p>Por favor inicia sesión para ver tus direcciones de envío.</p>

  return (
    <div>
      {user && (
        <>
          <section className="flex flex-wrap gap-2 items-center mb-2 justify-between">
            <h1>Direcciones de envío</h1>
            <div className="flex gap-2 items-center flex-wrap justify-center">
              <CreateShippingAddress />
              {address && (
                <>
                  <Update address={address} />
                  <DeleteAddress address={address} userId={user.id} />
                </>
              )}
            </div>
          </section>
          {shippingAddressesQuery.data?.length ? (
            <ListAddresses addresses={shippingAddressesQuery.data} />
          ) : (
            <p>No tienes direcciones de envío guardadas.</p>
          )}
        </>
      )}
    </div>
  )
}

export default ShippingAddress
