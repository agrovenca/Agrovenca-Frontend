import Footer from '@/components/pages/Footer'
import Navbar from '@/components/pages/HomeNavbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  OrderItem,
  OrderStatus,
  orderStatusConfig,
  PaymentStatus,
  paymentStatusConfig,
} from '@/types/order'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { ChevronDown, ChevronUp, ExternalLinkIcon } from 'lucide-react'
import { getLocalDateTime, pluralize, spaceBaseUrl } from '@/lib/utils'
import useUserOrders from '@/hooks/orders/useUserOrders'
import { useAuthStore } from '@/store/auth/useAuthStore'
import ProductImage from '@/components/pages/products/ProductImage'
import UploadReceipt from './UploadReceipt'
import { GetPaymentStatus } from '../dashboard/orders'
import { useMetaTags } from '@/hooks/useSEO'

function RenderOrderItem({ item }: { item: OrderItem }) {
  return (
    <div key={item.id} className="flex items-center gap-3">
      <ProductImage product={item.product} className="w-[60px] h-[60px] rounded-md" />
      <div className="flex-1">
        <p className="font-medium">{item.product.name}</p>
        <p className="text-sm text-muted-foreground">
          Cantidad: {item.quantity} × ${item.price}
        </p>
      </div>
      <p className="font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</p>
    </div>
  )
}

function UserOrdersPage() {
  const user = useAuthStore((state) => state.user)
  const { useOrdersQuery } = useUserOrders({ userId: user?.id || '' })
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    )
  }

  useMetaTags({
    title: `Órdenes | Agrovenca`,
    description: 'Maneja tus órdenes de Agrovenca',
  })

  return (
    <div>
      <Navbar />
      <section className="container mx-auto py-4 px-2 min-h-screen">
        {useOrdersQuery.isFetching && (
          <div className="flex items-center justify-center gap-2">
            <Loader />
            <span>Cargando...</span>
          </div>
        )}
        {useOrdersQuery.isSuccess && useOrdersQuery.data.length ? (
          <section>
            <div className="flex gap-4 items-center justify-center my-8">
              {Object.entries(OrderStatus).map((statusElement) => {
                const StatusIcon = orderStatusConfig[statusElement[1]].icon
                return (
                  <Badge
                    key={statusElement[0]}
                    className={`${orderStatusConfig[statusElement[1]].color} border`}
                  >
                    <StatusIcon className="h-6 w-6 mr-1" />
                    {orderStatusConfig[statusElement[1]].label}
                  </Badge>
                )
              })}
            </div>
            <div className="flex gap-4 items-center justify-center my-8">
              {Object.entries(PaymentStatus).map((statusElement) => {
                const PaymentStatusIcon = paymentStatusConfig[statusElement[1]].icon
                return (
                  <Badge
                    key={statusElement[0]}
                    className={`${paymentStatusConfig[statusElement[1]].color} border`}
                  >
                    <PaymentStatusIcon className="h-6 w-6 mr-1" />
                    {paymentStatusConfig[statusElement[1]].label}
                  </Badge>
                )
              })}
            </div>
            <div className="flex flex-col gap-4">
              {useOrdersQuery.data.map((order) => {
                const isExpanded = expandedOrders.includes(order.id)
                const OrderIcon = orderStatusConfig[order.status].icon
                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <CardTitle className="text-lg">{order.id}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Creado el: {getLocalDateTime(order.createdAt, ['es-ve'])}
                            </p>
                          </div>
                          <Badge className={`${orderStatusConfig[order.status].color} border`}>
                            <OrderIcon className="h-4 w-4 mr-1" />
                            {orderStatusConfig[order.status].label}
                          </Badge>
                          {order.payment ? (
                            <GetPaymentStatus payment={order.payment} />
                          ) : (
                            'Cargar comprobante'
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="font-semibold">${order.total}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} {pluralize('producto', order.items, 's')}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleOrderExpansion(order.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Order Items Preview */}
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2 mb-4">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={item.id} className="relative">
                            <figure className="w-[40px] h-[40px] overflow-hidden rounded-md">
                              <ProductImage product={item.product} className="w-full h-full" />
                            </figure>
                            {index === 2 && order.items.length > 3 && (
                              <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  +{order.items.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {order.items[0].product.name}
                            {order.items.length > 1 &&
                              ` y ${pluralize('otro', order.items.length - 1, 's')} ${pluralize(
                                'producto',
                                order.items.length - 1,
                                's'
                              )}`}
                          </p>
                        </div>
                      </div>

                      {/* Expanded Order Details */}
                      {isExpanded && (
                        <div className="space-y-4 border-t pt-4">
                          {/* All Items */}
                          <div className="space-y-3">
                            <h4 className="font-medium">Productos</h4>
                            {order.items.map((item) => (
                              <RenderOrderItem key={item.id} item={item} />
                            ))}
                          </div>

                          <Separator />

                          {/* Order Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-2">Dirección de envío</h4>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>{order.shipping.alias}</p>
                                <p>
                                  {order.shipping.name} {order.shipping.lastName}
                                </p>
                                <p>{order.shipping.address_line_1}</p>
                                <div className="flex gap-2">
                                  <Badge variant={'outline'}>{order.shipping.city}</Badge>
                                  {'>'}
                                  <Badge variant={'secondary'}>{order.shipping.state}</Badge>
                                  {'>'}
                                  <Badge>{order.shipping.country}</Badge>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Resumen del pedido</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Subtotal</span>
                                  <span>${order.subtotal}</span>
                                </div>
                                {Number(order.discount) > 0 && (
                                  <div className="flex justify-between text-green-600">
                                    <span>Descuento</span>
                                    <span>-${order.discount}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>Impuesto</span>
                                  <span>${order.tax}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-medium">
                                  <span>Total</span>
                                  <span>${order.total}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Order Actions */}
                          <div className="flex flex-wrap gap-2">
                            {!order.payment || !order.payment.receipt.length ? (
                              <UploadReceipt
                                order={order}
                                userId={user?.id as string}
                                key={'upload' + order.id}
                              />
                            ) : (
                              <p className="flex items-center gap-1">
                                <span>Pago cargado </span>
                                <a
                                  href={spaceBaseUrl + order.payment.receipt}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500"
                                >
                                  <ExternalLinkIcon />
                                </a>
                              </p>
                            )}
                            {order.status === OrderStatus.DELIVERED && (
                              <Button variant="outline" size="sm">
                                Descargar factura
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        ) : (
          <p>No hay órdenes disponibles</p>
        )}
      </section>
      <Footer />
    </div>
  )
}

export default UserOrdersPage
