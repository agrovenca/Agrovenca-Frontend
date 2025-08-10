import { Badge } from '@/components/ui/badge'
import { Loader } from '@/components/ui/loader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import useOrders from '@/hooks/orders/useOrders'
import { getLocalDateTime } from '@/lib/utils'
import { orderStatusConfig, paymentStatusConfig } from '@/types/order'

function OrdersPage() {
  const { ordersQuery } = useOrders()
  return (
    <div>
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">#</TableHead>
            <TableHead className="w-[100px]">Productos</TableHead>
            <TableHead className="">Usuario</TableHead>
            <TableHead>Creada</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersQuery.isFetching ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                <div className="flex items-center justify-center h-full w-full gap-2">
                  <Loader size="md" />
                  <span>Cargando...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : ordersQuery.data && ordersQuery.data.length > 0 ? (
            ordersQuery.data.map((order) => {
              const OrderIcon = orderStatusConfig[order.status].icon
              const PaymentOrderIcon = paymentStatusConfig[order.paymentStatus].icon
              return (
                <TableRow key={order.id} className="font-serif">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex justify-center">{order.items.length}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {order.user.name} {order.user.lastName}
                  </TableCell>

                  <TableCell className="italic">
                    {getLocalDateTime(order.createdAt, ['es-ve'])}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${paymentStatusConfig[order.paymentStatus].color} border`}>
                      <PaymentOrderIcon className="h-4 w-4 mr-1" />
                      {paymentStatusConfig[order.paymentStatus].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${orderStatusConfig[order.status].color} border`}>
                      <OrderIcon className="h-4 w-4 mr-1" />
                      {orderStatusConfig[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2">Opciones</div>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No existen ordenes
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default OrdersPage
