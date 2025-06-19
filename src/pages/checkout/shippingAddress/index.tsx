import { getShippingAddresses } from '@/actions/shippingData'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { type ShippingAddress } from '@/types/shippingAddress'
import { useCallback, useEffect, useState } from 'react'
import FormCreate from './FormCreate'
import CreateShippingAddress from './Create'
import { useShippindAddressStore } from '@/store/shippingAddresses'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

function ListAddresses() {
  const addresses = useShippindAddressStore((state) => state.addresses)
  const [selected, setSelected] = useState<string | null>(null) // Id of the selected address

  return addresses.length ? (
    <>
      <section className="flex gap-2 justify-between">
        {addresses.map((address) => (
          <RadioGroup
            defaultValue="option-one"
            key={address.pk}
            className="cursor-pointer"
            onValueChange={(e) => {
              setSelected(e)
              return e
            }}
          >
            <Label
              htmlFor={`option-${address.pk}`}
              className="border p-4 mb-4 rounded-lg transition hover:scale-[1.01] font-serif flex gap-2"
            >
              <RadioGroupItem value={address.pk} id={`option-${address.pk}`} className="m-0" />
              <div className="space-y-2">
                <h3>{address.alias}</h3>
                <p>
                  {address.name} {address.lastName}
                </p>
                <p>{address.email}</p>
                <p>{address.phone}</p>
                <p>{address.address_line_1}</p>
                <p>
                  {address.city}, {address.state}, {address.country}
                </p>
              </div>
            </Label>
          </RadioGroup>
        ))}
      </section>
      {selected &&
        {
          /* Show button for reset selected option */
        }}
    </>
  ) : (
    <p>No shipping addresses found.</p>
  )
}

function ShippingAddress() {
  const [isLoading, setIsLoading] = useState(false)
  const user = useAuthStore((state) => state.user)
  const setAddresses = useShippindAddressStore((state) => state.setAddresses)

  const fetchData = useCallback(
    async (userId: string) => {
      // Fetch shipping address data
      setIsLoading(true)
      try {
        const res = await getShippingAddresses(userId)
        if (res.status !== 200) {
          throw new Error('Failed to fetch shipping addresses')
        }
        setAddresses(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    },
    [setAddresses]
  )

  useEffect(() => {
    if (user) {
      fetchData(user.id)
    }
  }, [fetchData, user])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {user ? (
        <>
          <section className="flex flex-wrap gap-2 items-center">
            <h1>Direcciones de envío</h1>
            <CreateShippingAddress />
          </section>
          <ListAddresses />
        </>
      ) : (
        <>
          <ListAddresses />
          <FormCreate />
        </>
      )}
    </div>
  )
}

export default ShippingAddress
