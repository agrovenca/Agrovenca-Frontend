import { cn } from '@/lib/utils'
import { OrderStatus, orderStatusConfig } from '@/types/order'

const OrderFlow = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
]

export function OrderProgress({ status }: { status: OrderStatus }) {
  const currentIndex = OrderFlow.indexOf(status)

  return (
    <div className={`relative grid grid-cols-4 items-center justify-evenly w-full py-6`}>
      {/* Línea base (fondo) */}
      <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-gray-200 -translate-y-1/2 z-0" />

      {/* Línea de progreso */}
      <div
        className="absolute top-1/2 h-[2px] bg-green-500 -translate-y-1/2 z-10 transition-all duration-500"
        style={{
          left: '0',
          width: `${((currentIndex + 1) / OrderFlow.length) * 100}%`,
        }}
      />

      {OrderFlow.map((s, i) => {
        const { icon: Icon, label } = orderStatusConfig[s]
        const isActive = i <= currentIndex

        return (
          <div key={s} className="col-span-1 relative z-20 flex flex-col items-center text-center">
            <div
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                isActive
                  ? 'border-green-500 bg-green-100 text-green-600'
                  : 'border-gray-200 bg-white text-gray-400'
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span
              className={cn(
                'mt-2 text-sm font-medium',
                isActive ? 'text-green-700' : 'text-gray-400'
              )}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
