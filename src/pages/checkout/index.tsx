import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Loader } from '@/components/ui/loader'
import { ModeToggle } from '@/components/mode-toggle'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useCartStore } from '@/store/cart/useCartStore'
import { Product } from '@/types/product'
import { ArrowLeftIcon, EllipsisIcon, Leaf, LockIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import ProductImagePlaceholder from '@/assets/images/productImagePlaceholder.png'
import { validateCart } from '@/actions/products'
import { CartItem } from '@/types/cart'
import UpdateCartItem from '../products/UpdateCartItem'
import { Button } from '@/components/ui/button'
import { pluralize } from '@/lib/utils'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Country, CountryStates, ShippingAddressSchema } from '@/schemas/products/shippingAddress'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TAX_VALUE = 0.12

type ValidatedCartItems = CartItem & {
  valid: boolean
  reason?: string
  availableStock?: number
}

interface InvalidCartItem {
  productId: string
  reason: string
}

function CheckOutPage() {
  const navigate = useNavigate()
  const [charCount, setCharCount] = useState(0)
  const [isLoading, _setIsLoading] = useState(false)
  const [invalidItems, setInvalidItems] = useState<InvalidCartItem[]>([])
  const cartItems = useCartStore((state) => state.items)
  const updateItem = useCartStore((state) => state.updateItem)
  const deleteItem = useCartStore((state) => state.deleteItem)

  const getProductPrice = (product: Product) =>
    product.secondPrice && product.secondPrice != 0 ? product.secondPrice : product.price
  const productImage = (product: Product) => product.images[0]?.s3Key || ProductImagePlaceholder
  const subtotal = cartItems
    .map((i) => getProductPrice(i.product) * i.quantity)
    .reduce((acc, price) => acc + price, 0)
  const tax = subtotal * TAX_VALUE
  const total = subtotal + tax

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

  const onSubmit: SubmitHandler<z.infer<typeof ShippingAddressSchema>> = (data) => {}

  useEffect(() => {
    if (!cartItems) {
      navigate('/products')
    }
  }, [cartItems, navigate])

  useEffect(() => {
    const fetchProducts = async () => {
      const items = cartItems.map(({ productId, quantity }) => ({
        productId,
        quantity,
      }))

      try {
        const res = await validateCart({ items })

        if (res.status !== 200) return

        const validatedItems: ValidatedCartItems[] = res.data.items
        const invalids = validatedItems.filter((i) => !i.valid)

        setInvalidItems(
          invalids.map(({ productId, reason }) => ({
            productId,
            reason: reason ?? '',
          }))
        )

        const updateMap = new Map<string, number>()

        invalids.forEach((item) => {
          const availableStock = item.availableStock ?? 0
          if (availableStock > 0) {
            updateMap.set(item.productId, availableStock)
          } else {
            deleteItem(item.productId)
          }
        })

        cartItems.forEach((cartItem) => {
          const newQty = updateMap.get(cartItem.productId)
          if (newQty !== undefined && newQty !== cartItem.quantity) {
            updateItem({ ...cartItem, quantity: newQty })
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full gap-2">
        <Loader size="md" />
        <span>Cargando...</span>
      </div>
    )
  }
  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto">
          <Link to={'/'} className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">Agrovenca</span>
          </Link>
          <div className="flex items-center gap-4">
            <LockIcon className="w-5 h-5" />
            <span className="text-sm text-muted-foreground">Secure Checkout</span>
          </div>
          <ModeToggle />
        </div>
      </header>
      <section className="container mx-auto py-4 px-2">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver a los productos
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold">
                    1
                  </div>
                  Dirección de envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          <FormLabel>Correo electrónico *</FormLabel>
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
                          <FormControl className="rounded-none rounded-b-lg">
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
                                  <SelectItem value={country}>{country}</SelectItem>
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
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            {invalidItems.length > 0 && (
              <>
                <div className="mb-4 p-3 border border-red-300 bg-red-50 rounded">
                  <div className="ml-5 text-sm text-red-700">
                    <p>
                      La cantidad de {invalidItems.length}{' '}
                      {pluralize('producto', invalidItems, 's')}
                      {pluralize('fue', invalidItems, 'ron')}
                      {pluralize('decrementada', invalidItems, 's')}
                      por insuficiencia de stock
                    </p>
                  </div>
                </div>
                <Separator className="mb-4" />
              </>
            )}

            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumen de la orden</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex items-start gap-3 relative">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            loading="lazy"
                            alt={item.product.name}
                            src={productImage(item.product)}
                            className="rounded-md object-cover w-15 h-15"
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src = ProductImagePlaceholder
                            }}
                          />
                          <Badge className="absolute font-serif -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-green-600">
                            {item.quantity}
                          </Badge>
                        </div>
                        <div className="w-full flex-1">
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground font-serif">
                            ${Number(getProductPrice(item.product)).toFixed(2)} cada uno
                          </p>
                        </div>
                      </div>
                      <div className="ml-auto flex gap-2">
                        <p className="font-medium font-serif">
                          ${(getProductPrice(item.product) * item.quantity).toFixed(2)}
                        </p>
                        <Popover>
                          <PopoverTrigger className="">
                            <EllipsisIcon />
                          </PopoverTrigger>
                          <PopoverContent className="flex justify-center items-center gap-4 flex-col w-fit">
                            <UpdateCartItem iconOnly={false} item={item} />
                            <Button
                              className="cursor-pointer w-full"
                              variant={'destructive'}
                              onClick={() => deleteItem(item.productId)}
                            >
                              <TrashIcon className="w-5 h-5" />
                              <span>Eliminar</span>
                            </Button>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-serif">${subtotal.toFixed(2)}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div> */}
                  <div className="flex justify-between">
                    <span>Impuesto ({TAX_VALUE * 100}%)</span>
                    <span className="font-serif">${tax.toFixed(2)}</span>
                  </div>
                  {/* {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )} */}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="font-serif">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* {shipping === 0 && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
                    <Check className="h-4 w-4" />
                    <span>Free shipping on orders over $25!</span>
                  </div>
                )} */}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CheckOutPage
