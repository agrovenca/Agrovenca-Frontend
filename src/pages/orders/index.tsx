import Footer from '@/components/pages/Footer'
import Navbar from '@/components/pages/HomeNavbar'
import { Badge } from '@/components/ui/badge'
import { Loader } from '@/components/ui/loader'
import { PaymentStatus, paymentStatusConfig } from '@/types/order'
import useUserOrders from '@/hooks/orders/useUserOrders'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { useMetaTags } from '@/hooks/useSEO'
import OrderCard from './OrderCard'
import { useState } from 'react'

function UserOrdersPage() {
  const user = useAuthStore((state) => state.user)
  const { useOrdersQuery } = useUserOrders({ userId: user?.id || '' })
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId))
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
            <div className="flex gap-4 items-center justify-center my-8 flex-wrap">
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
              {useOrdersQuery.data.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  expandedOrderId={expandedOrderId}
                  onToggle={toggleOrderExpansion}
                />
              ))}
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
