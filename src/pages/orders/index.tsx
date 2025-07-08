import { getOrders } from '@/actions/orders'
import Navbar from '@/components/pages/HomeNavbar'
import { Badge } from '@/components/ui/badge'
import { Loader } from '@/components/ui/loader'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Order, OrderStatusLabels } from '@/types/order'
import { useCallback, useEffect, useState } from 'react'

function OrdersPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await getOrders()
      if (res.status === 200) {
        setOrders(res.data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div>
      <Navbar />
      <section className="container mx-auto py-4 px-2">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="flex items-center justify-center gap-2">
                    <Loader />
                    <span>Cargando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : orders.length ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-semibold">{order.id}</TableCell>
                  <TableCell className="font-semibold">
                    <Badge variant="secondary" className="font-serif">
                      {OrderStatusLabels[order.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}

export default OrdersPage
