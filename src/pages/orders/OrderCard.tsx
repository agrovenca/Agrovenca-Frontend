import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GetPaymentStatus } from '../dashboard/orders'
import { Order, OrderItem, OrderStatus, orderStatusConfig } from '@/types/order'
import { getLocalDateTime, pluralize, spaceBaseUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Undo2, XCircle } from 'lucide-react'
import ProductImage from '@/components/pages/products/ProductImage'
import { Separator } from '@/components/ui/separator'
import UploadReceipt from './UploadReceipt'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { OrderProgress } from './OrderProgress'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Link } from 'react-router'

interface Props {
  order: Order
  expandedOrderId: string | null
  onToggle: (orderId: string) => void
}

function OrderCard({ order, expandedOrderId, onToggle }: Props) {
  const user = useAuthStore((state) => state.user)

  const isExpanded = expandedOrderId === order.id
  const OrderIcon = orderStatusConfig[order.status].icon

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <CardTitle className="text-sm md:text-lg">{order.id}</CardTitle>
              <p className="text-xs md:text-sm text-muted-foreground">
                Creado el: {getLocalDateTime(order.createdAt, ['es-ve'])}
              </p>
            </div>
            {!isExpanded && (
              <Badge className={`${orderStatusConfig[order.status].color} border`}>
                <OrderIcon className="h-4 w-4 mr-1" />
                {orderStatusConfig[order.status].label}
              </Badge>
            )}
            <GetPaymentStatus payment={order.payment} />
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-semibold">${order.total}</p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {order.items.length} {pluralize('producto', order.items, 's')}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onToggle(order.id)}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                  <span className="text-white text-xs font-medium">+{order.items.length - 3}</span>
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
            <OrderProgress status={order.status} />
            <div className="max-w-2xl mx-auto">
              {order.status === OrderStatus.CANCELLED && (
                <Alert variant="destructive">
                  <XCircle className="h-5 w-5" />
                  <AlertTitle>
                    Esta orden fue cancelada. Si ya habías realizado el pago, por favor{' '}
                    <Link to="/contact" className="underline">
                      contacta con soporte.
                    </Link>
                  </AlertTitle>
                </Alert>
              )}

              {order.status === OrderStatus.RETURNED && (
                <Alert>
                  <Undo2 className="h-5 w-5" />
                  <AlertTitle>
                    Esta orden fue devuelta. Si tienes preguntas, por favor{' '}
                    <Link to="/contact" className="underline">
                      contacta con soporte.
                    </Link>
                  </AlertTitle>
                </Alert>
              )}
            </div>
            <Separator />
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
                <Badge
                  variant={'outline'}
                  asChild
                  className="py-2 px-4 flex items-center justify-center transition hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <a
                    href={spaceBaseUrl + order.payment.receipt}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver comprobante de pago
                  </a>
                </Badge>
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
}

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

export default OrderCard
