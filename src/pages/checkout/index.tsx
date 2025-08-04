import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { ModeToggle } from '@/components/mode-toggle'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useCartStore } from '@/store/cart/useCartStore'
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  EllipsisIcon,
  Leaf,
  LockIcon,
  Tag,
  TrashIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { validateCart } from '@/actions/products'
import { CartItem } from '@/types/cart'
import UpdateCartItem from '../products/UpdateCartItem'
import { Button } from '@/components/ui/button'
import { getFirstProductImage, pluralize, productImagePlaceholder } from '@/lib/utils'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CouponApplySchema } from '@/schemas/coupons'
import ShippingAddress from './shippingAddress'
import { useShippingAddressStore } from '@/store/shippingAddresses/useAddressesStore'
import { getCoupon } from '@/actions/coupons'
import { CouponType, CouponTypes } from '@/types/coupon'
import { toast } from 'sonner'
import { useAppliedCouponStore } from '@/store/coupons/useCouponsStore'
import useCreateOrder from '@/hooks/orders/useCreateOrder'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { useAuthStore } from '@/store/auth/useAuthStore'
import useShippingAddresses from '@/hooks/shipping/useShippingAddresses'
import { Loader } from '@/components/ui/loader'
import { getProductPrice } from '@/lib/getProductPrice'

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

const generateNewOrderId = () => {
  // Year - Month - Day - Hour - Minute - Second - Milliseconds + Cart Item Count
  const prefix = 'ORD-'
  const now = new Date()
  const year = now.getFullYear().toString()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hour = now.getHours().toString().padStart(2, '0')
  const minute = now.getMinutes().toString().padStart(2, '0')
  const second = now.getSeconds().toString().padStart(2, '0')
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0')

  return `${prefix}${year}${month}${day}${hour}${minute}${second}${milliseconds}`
}

function CheckOutPage() {
  useRequireAuth()
  const navigate = useNavigate()
  const [invalidItems, setInvalidItems] = useState<InvalidCartItem[]>([])
  const [couponError, setCouponError] = useState('')
  const appliedCoupon = useAppliedCouponStore((state) => state.coupon)
  const setAppliedCoupon = useAppliedCouponStore((state) => state.setCoupon)
  const removeAppliedCoupon = useAppliedCouponStore((state) => state.removeCoupon)

  const cartItems = useCartStore((state) => state.items)
  const updateItem = useCartStore((state) => state.updateItem)
  const deleteItem = useCartStore((state) => state.deleteItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const selectedAddress = useShippingAddressStore((state) => state.selectedAddress)
  const setSelectedAddress = useShippingAddressStore((state) => state.setSelectedAddress)
  const user = useAuthStore((state) => state.user)
  const { shippingAddressesQuery } = useShippingAddresses({ userId: user?.id ?? '' })
  const shippingAddress = shippingAddressesQuery.data?.find(
    (address) => address.pk === selectedAddress
  )

  const { createOrderMutation } = useCreateOrder({ userId: user?.id || '', shippingAddress })

  const orderNumber = useMemo(() => {
    return generateNewOrderId() + cartItems.length.toString().padStart(3, '0')
  }, [cartItems.length])

  const couponForm = useForm<z.infer<typeof CouponApplySchema>>({
    resolver: zodResolver(CouponApplySchema),
    defaultValues: {
      code: '',
    },
  })

  const subtotal = cartItems
    .map((i) => getProductPrice(i.product) * i.quantity)
    .reduce((acc, price) => acc + price, 0)

  const getCouponDiscount = (coupon: CouponType) => {
    if (coupon.type === CouponTypes.PERCENTAGE) {
      return subtotal * (coupon.discount / 100)
    }
    return coupon.discount || 0
  }

  const getDiscountType = (coupon: CouponType) => {
    if (coupon.type === CouponTypes.PERCENTAGE) {
      return `${coupon.discount}%`
    }
    return `$${coupon.discount.toFixed(2)}`
  }

  const getSubtotal = () => {
    return subtotal - (appliedCoupon ? getCouponDiscount(appliedCoupon) : 0)
  }

  const getTax = () => {
    const subtotal = getSubtotal()
    return subtotal * TAX_VALUE
  }

  const getTotal = () => {
    const subtotal = getSubtotal()
    const tax = getTax()
    return subtotal + tax
  }

  const validateCoupon = async ({ coupon }: { coupon: CouponType }) => {
    setCouponError('')

    if (coupon.validCategories?.length) {
      const validCategories = coupon.validCategories
      const hasInvalidCategory = cartItems.some(
        (item) => !validCategories.includes(item.product.categoryId)
      )
      if (hasInvalidCategory) {
        setCouponError('El cupón no es válido para algunos productos en tu carrito.')
        return false
      }
    }
    if (coupon.minPurchase && getSubtotal() < coupon.minPurchase) {
      setCouponError(
        `El cupón requiere una compra mínima de $${coupon.minPurchase.toFixed(
          2
        )} y tu subtotal es $${getSubtotal().toFixed(2)}.`
      )
      return false
    }

    return true
  }

  const onSubmitCoupon: SubmitHandler<z.infer<typeof CouponApplySchema>> = async (data) => {
    try {
      const res = await getCoupon(data.code)
      if (res.status !== 200) {
        setCouponError(res.error || 'Error applying coupon')
        return
      }
      const { coupon, message } = await res.data
      const isValid = await validateCoupon({ coupon })

      if (isValid) {
        setAppliedCoupon(coupon)
        toast.success(message)
      }
    } catch (error) {
      console.error('Error applying coupon:', error)
      setCouponError('Error applying coupon. Please try again later.')
    } finally {
      couponForm.reset({ code: '' })
    }
  }

  const removeCoupon = () => {
    removeAppliedCoupon()
    setCouponError('')
    toast.success('Cupón eliminado exitosamente.')
  }

  async function generateOrder() {
    if (!selectedAddress) {
      toast.error('Por favor, selecciona una dirección de envío.')
      return
    }
    const orderData = {
      id: orderNumber,
      couponId: appliedCoupon?.id,
      shippingAddressId: selectedAddress,
      products: cartItems.map((item) => ({
        id: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        price: Number(getProductPrice(item.product)),
        categoryId: item.product.categoryId,
      })),
      subtotal: Number(getSubtotal().toFixed(2)),
      discount: appliedCoupon ? getCouponDiscount(appliedCoupon) : 0,
      tax: Number(getTax().toFixed(2)),
      total: Number(getTotal().toFixed(2)),
    }

    createOrderMutation.mutate(
      { newData: orderData },
      {
        onSuccess: ({ message }) => {
          toast.success(message)
          clearCart()
          setSelectedAddress('')
          removeAppliedCoupon()
          navigate(`/orders/`)
        },
        onError: (err) => {
          const errorMsg = () => {
            if (err instanceof Error) return err.message
            return 'Ocurrió un error. Por favor intenta de nuevo.'
          }
          toast.error(errorMsg())
        },
      }
    )
  }

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

  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-2 mx-auto">
          <Link to={'/'} className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">Agrovenca</span>
          </Link>
          <div className="flex items-center gap-4">
            <LockIcon className="w-5 h-5" />
            <span className="text-sm text-muted-foreground">Pago Seguro</span>
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
        <h2 className="my-4 text-2xl text-center">
          <span className="text-nowrap">Número de orden</span>{' '}
          <span className="text-yellow-500 text-nowrap">{orderNumber}</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
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
                <ShippingAddress />
              </CardContent>
            </Card>
            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold">
                    2
                  </div>
                  Código de cupón
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md dark:bg-black dark:border-green-600">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-500">
                          {appliedCoupon.code}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {appliedCoupon.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={removeCoupon}
                      disabled={createOrderMutation.isPending}
                      className="text-green-600 hover:text-green-700 font-serif"
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <Form {...couponForm}>
                    <form className="space-y-3" onSubmit={couponForm.handleSubmit(onSubmitCoupon)}>
                      <div className="flex gap-2 items-start">
                        <div className="flex-1">
                          <FormField
                            control={couponForm.control}
                            name="code"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Ingresa un código de cupón" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Ingresa el código de cupón para aplicar un descuento a tu orden.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="submit"
                          variant="outline"
                          disabled={
                            !couponForm.formState.isValid ||
                            couponForm.formState.isSubmitting ||
                            createOrderMutation.isPending
                          }
                          className={
                            'font-serif' +
                            (couponForm.formState.isValid &&
                              !couponForm.formState.isSubmitting &&
                              !createOrderMutation.isPending)
                              ? 'cursor-pointer'
                              : 'cursor-not-allowed'
                          }
                        >
                          Aplicar
                        </Button>
                      </div>
                      {couponError && (
                        <Alert variant="destructive">
                          <AlertDescription>{couponError}</AlertDescription>
                        </Alert>
                      )}
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
            <Button
              type="button"
              onClick={generateOrder}
              disabled={cartItems.length === 0 || !selectedAddress || createOrderMutation.isPending}
              className={`bg-blue-500 hover:bg-blue-600 text-white uppercase flex items-center gap-2 group py-6 justify-center w-full tracking-wider ${
                cartItems.length === 0 || !selectedAddress || createOrderMutation.isPending
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >
              {createOrderMutation.isPending ? (
                <div className="flex gap-2 items-center">
                  <Loader className="w-5 h-5" />
                  <span>Creando order...</span>
                </div>
              ) : (
                <>
                  <span>Generar orden</span>
                  <ChevronRightIcon className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
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
                  {cartItems.map((item) => {
                    const firstImage = getFirstProductImage(item.product.images)
                    return (
                      <div key={item.productId} className="flex items-start gap-3 relative">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              loading="lazy"
                              alt={item.product.name}
                              src={firstImage.s3Key}
                              className="rounded-md object-cover w-15 h-15"
                              onError={(e) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.src = productImagePlaceholder
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
                    )
                  })}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-serif">${getSubtotal().toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento (-{getDiscountType(appliedCoupon)})</span>
                      <span>-${getCouponDiscount(appliedCoupon).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Impuesto ({TAX_VALUE * 100}%)</span>
                    <span className="font-serif">${getTax().toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="font-serif">${getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CheckOutPage
