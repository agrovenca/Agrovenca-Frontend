import { Package, CreditCardIcon } from 'lucide-react'
import { ProductImage } from '../product/images'
import { User } from '../auth/user'

export interface Order {
  id: string
  userId: string
  shippingId: string
  couponId: string
  orderPaymentId?: string
  tax: string
  subtotal: string
  discount: string
  total: string
  createdAt: string
  updatedAt: string
  user: {
    id: User['id']
    name: User['name']
    lastName: User['lastName']
    email: User['email']
  }
  coupon: Coupon
  items: OrderItem[]
  shipping: Shipping
  status: OrderStatus
  payment?: OrderPayment
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: string
  product: Product
}

export interface OrderPayment {
  id: string
  orderId: string
  status: PaymentStatus
  receipt: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  name: string
  images: ProductImage[]
}

export interface Shipping {
  pk: string
  alias: string
  name: string
  lastName: string
  email: string
  phone: string
  address_line_1: string
  country: string
  state: string
  city: string
  isDefault: boolean
  createdAt: string
  userId: string
}

export interface Coupon {
  code: string
  discount: number
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pendiente',
  [OrderStatus.PROCESSING]: 'Procesando',
  [OrderStatus.SHIPPED]: 'Enviado',
  [OrderStatus.DELIVERED]: 'Entregado',
  [OrderStatus.CANCELLED]: 'Cancelado',
  [OrderStatus.RETURNED]: 'Devuelto',
}

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.UNPAID]: 'No pagado',
  [PaymentStatus.PROCESSING]: 'Procesando',
  [PaymentStatus.PAID]: 'Pagado',
  [PaymentStatus.REFUNDED]: 'Rembolsado',
}

type StatusConfig = {
  label: string
  color: string
  icon: React.ElementType
}

export const orderStatusConfig: Record<OrderStatus, StatusConfig> = {
  [OrderStatus.PENDING]: {
    label: 'Pendiente',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Package,
  },
  [OrderStatus.PROCESSING]: {
    label: 'Procesando',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Package,
  },
  [OrderStatus.SHIPPED]: {
    label: 'Enviado',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Package,
  },
  [OrderStatus.DELIVERED]: {
    label: 'Entregado',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Package,
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: Package,
  },
  [OrderStatus.RETURNED]: {
    label: 'Devuelto',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: Package,
  },
}

export const paymentStatusConfig: Record<PaymentStatus, StatusConfig> = {
  [PaymentStatus.UNPAID]: {
    label: 'No pagado',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: CreditCardIcon,
  },
  [PaymentStatus.PROCESSING]: {
    label: 'Procesando',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: CreditCardIcon,
  },
  [PaymentStatus.PAID]: {
    label: 'Pagado',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CreditCardIcon,
  },
  [PaymentStatus.REFUNDED]: {
    label: 'Rembolsado',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: CreditCardIcon,
  },
}

export interface OrderResponse {
  order: Order
  message: string
}

export interface OrderPaymentResponse {
  payment: OrderPayment
  message: string
}
