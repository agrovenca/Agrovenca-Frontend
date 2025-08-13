import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import useOrders from '@/hooks/orders/useOrders'
import useProducts from '@/hooks/products/useProducts'
import useUsers from '@/hooks/users/useUsers'
import { OrderStatus } from '@/types/order'
import { ReactNode, useState } from 'react'

interface Options {
  label: string
  onClick: () => void
  isActive: boolean
  children: ReactNode
}

function RenderCard({ label, onClick, isActive, children }: Options) {
  const activeClass = 'scale-95'
  return (
    <Card
      onClick={onClick}
      className={`w-full max-w-sm cursor-pointer transition border-y-0 border-r-0 border-l-6 border-primary bg-primary/20 hover:bg-primary/40 dark:hover:bg-blue-700/30 dark:bg-blue-600/30 dark:border-blue-700 group relative overflow-hidden ${
        isActive ? activeClass : ''
      }`}
    >
      {/* <!-- Barra inclinada de brillo --> */}
      <span
        className="pointer-events-none absolute top-[-50%] left-[-50%] h-[200%] w-1/3
           bg-gradient-to-r from-transparent via-[white]/40 to-transparent
           rotate-12
           transform-gpu
           transition-transform duration-1000 ease-in-out
           group-hover:translate-x-[500%]"
      ></span>
      <CardHeader>
        <CardTitle className="font-serif tracking-wider font-extrabold">{label}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-extrabold font-serif text-6xl">{children}</p>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}

function UsersTab() {
  return <>Users Tab</>
}
function ProductsTab() {
  return <>Products Tab</>
}
function OrdersTab() {
  return <>Orders Tab</>
}

function DahsboardIndex() {
  const [active, setActive] = useState<string | undefined>(undefined)

  const { usersQuery } = useUsers({})
  const { productsQuery } = useProducts({})
  const { ordersQuery } = useOrders()

  const handleActive = (label: string) => {
    if (active == label) {
      setActive(undefined)
      return
    }

    setActive(label)
  }

  return (
    <section>
      <section className="flex gap-2 items-stretch">
        <RenderCard
          label="Total usuarios"
          isActive={active == 'users'}
          onClick={() => handleActive('users')}
        >
          {usersQuery.data?.pagination.totalItems || 0}
        </RenderCard>
        <RenderCard
          label="Total productos"
          isActive={active == 'products'}
          onClick={() => handleActive('products')}
        >
          {productsQuery.data?.pagination.totalItems || 0}
        </RenderCard>
        <RenderCard
          label="Pedidos pendientes"
          isActive={active == 'orders'}
          onClick={() => handleActive('orders')}
        >
          <div>
            <div>
              {ordersQuery.data?.filter((order) => order.status === OrderStatus.PENDING).length ||
                0}
            </div>
            <div className="absolute bottom-4 right-4 text-2xl">
              <span>Total: {ordersQuery.data?.length || 0}</span>
            </div>
          </div>
        </RenderCard>

        <RenderCard
          label={`Total ${20.475}`}
          isActive={active == 'default'}
          onClick={() => handleActive('default')}
        >
          20.475
        </RenderCard>
      </section>
      <div className="my-8">
        {active == 'users' && <UsersTab />}
        {active == 'products' && <ProductsTab />}
        {active == 'orders' && <OrdersTab />}
        {active == 'default' && 'Default Tab'}
        {active ?? 'Clickea en una tarjeta para ver más información'}
      </div>
    </section>
  )
}

export default DahsboardIndex
