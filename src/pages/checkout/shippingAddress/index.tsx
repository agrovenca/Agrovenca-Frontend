import { useEffect, useState } from 'react'
import CreateShippingAddress from './Create'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { useShippingAddressStore } from '@/store/shippingAddresses/useAddressesStore'
import { getShippingAddresses } from '@/actions/shippingData'
import { type ShippingAddress } from '@/types/shippingAddress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import z from 'zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { EditIcon, TrashIcon } from 'lucide-react'
import Update from './Update'

function ListAddresses() {
  const user = useAuthStore((state) => state.user)
  const addresses = useShippingAddressStore((state) => state.addresses)

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
      address: '',
    },
  })

  return addresses.length && user ? (
    <Form {...form}>
      <form className="flex gap-2 justify-evenly">
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
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  className="flex gap-2 justify-evenly"
                >
                  {addresses.length &&
                    addresses.map((address) => (
                      <FormItem
                        className="flex flex-col max-w-md w-full items-center gap-3 border p-4 mb-4 rounded-lg transition hover:scale-[1.01] font-serif"
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
                        <div className="flex gap-2">
                          <Update address={address} />
                          <Button variant="destructive" size={'icon'} className="cursor-pointer">
                            <TrashIcon className="w-5 h-5" />
                          </Button>
                        </div>
                      </FormItem>
                    ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
              {field.value && (
                <Button type="reset" onClick={() => form.reset()} disabled={!field.value}>
                  Limpiar selección
                </Button>
              )}
            </FormItem>
          )}
        />
      </form>
    </Form>
  ) : (
    <>
      {user ? (
        <p>No shipping addresses found.</p>
      ) : (
        <p>Please log in to view your shipping addresses.</p>
      )}
    </>
  )
}

function ShippingAddress() {
  const [isLoading, setIsLoading] = useState(false)
  const user = useAuthStore((state) => state.user)
  const setAddresses = useShippingAddressStore((state) => state.setAddresses)

  // const fetchData = useCallback(
  //   async (userId: string) => {
  //     // Fetch shipping address data
  //     setIsLoading(true)
  //     try {
  //       const res = await getShippingAddresses(userId)
  //       if (res.status !== 200) {
  //         throw new Error('Failed to fetch shipping addresses')
  //       }
  //       setAddresses(res.data)
  //     } catch (error) {
  //       console.error(error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   },
  //   [setAddresses]
  // )

  useEffect(() => {
    const fetchData = async () => {
      // Fetch shipping address data
      setIsLoading(true)
      try {
        const res = await getShippingAddresses()
        if (res.status !== 200) {
          throw new Error('Failed to fetch shipping addresses')
        }
        setAddresses(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user, setAddresses])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {user ? (
        <>
          <section className="flex flex-wrap gap-2 items-center mb-2">
            <h1>Direcciones de envío</h1>
            <CreateShippingAddress />
          </section>
          <ListAddresses />
        </>
      ) : (
        <>
          <ListAddresses />
        </>
      )}
    </div>
  )
}

export default ShippingAddress
