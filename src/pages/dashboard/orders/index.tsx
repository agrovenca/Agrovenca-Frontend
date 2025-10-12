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
import { OrderPayment, orderStatusConfig, PaymentStatus, paymentStatusConfig } from '@/types/order'
import OrderUpdateStatusPage from './UpdateStatus'
import OrdersFilters from './Filters'
import Pagination from '@/components/blocks/pagination'
import { useOrderFiltersStore } from '@/store/orders/useOrderFiltersStore'

export const GetPaymentStatus = ({ payment }: { payment?: OrderPayment }) => {
  const paymentStatus = payment ? payment.status : PaymentStatus.UNPAID
  const PaymentOrderIcon = paymentStatusConfig[paymentStatus].icon

  if (!payment) {
    return (
      <Badge className={`${paymentStatusConfig[paymentStatus].color} border`}>
        <PaymentOrderIcon className="h-4 w-4 mr-1" />
        {paymentStatusConfig[paymentStatus].label}
      </Badge>
    )
  }
  return (
    <Badge className={`${paymentStatusConfig[paymentStatus].color} border`}>
      <PaymentOrderIcon className="h-4 w-4 mr-1" />
      {paymentStatusConfig[paymentStatus].label}
    </Badge>
  )
}

function OrdersPage() {
  const { limit } = useOrderFiltersStore()
  const { ordersQuery, setNextPage, setPrevPage, setPageNumber } = useOrders()

  return (
    <div>
      <OrdersFilters />
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">#</TableHead>
            <TableHead className="w-[100px]">Productos</TableHead>
            <TableHead className="">Usuario</TableHead>
            <TableHead>Creada</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead>Status</TableHead>
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
          ) : ordersQuery.isSuccess && ordersQuery.data.objects.length > 0 ? (
            ordersQuery.data.objects.map((order) => {
              const OrderIcon = orderStatusConfig[order.status].icon
              return (
                <TableRow key={order.id} className="font-serif">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex justify-center">{order.items.length}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <p>
                      {order.user.name} {order.user.lastName}
                    </p>
                    <small className="text-gray-500 dark:text-gray-400">{order.user.email}</small>
                  </TableCell>
                  <TableCell className="italic">
                    {getLocalDateTime(order.createdAt, ['es-ve'])}
                  </TableCell>
                  <TableCell>
                    <GetPaymentStatus payment={order.payment} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <Badge className={`${orderStatusConfig[order.status].color} border`}>
                        <OrderIcon className="h-4 w-4 mr-1" />
                        {orderStatusConfig[order.status].label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>
                    <OrderUpdateStatusPage order={order} />
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
      {ordersQuery.data && (
        <Pagination
          paginationData={ordersQuery.data.pagination}
          currentItems={ordersQuery.data.objects.length}
          setNextPage={setNextPage}
          setPrevPage={setPrevPage}
          setPageNumber={setPageNumber}
          limit={limit}
        />
      )}
    </div>
  )
}

export default OrdersPage
