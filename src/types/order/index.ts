import { Clock, Truck, CheckCircle, Package, RotateCcw } from 'lucide-react'
import { ProductImage } from '../product/images'

export interface Order {
  id: string
  userId: string
  shippingId: string
  couponId: string
  tax: string
  subtotal: string
  discount: string
  total: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  shipping: Shipping
  coupon: Coupon
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: string
  product: Product
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

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pendiente',
  [OrderStatus.PROCESSING]: 'Procesando',
  [OrderStatus.SHIPPED]: 'Enviado',
  [OrderStatus.DELIVERED]: 'Entregado',
  [OrderStatus.CANCELLED]: 'Cancelado',
  [OrderStatus.RETURNED]: 'Devuelto',
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
    icon: Clock,
  },
  [OrderStatus.PROCESSING]: {
    label: 'Procesando',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  [OrderStatus.SHIPPED]: {
    label: 'Enviado',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Truck,
  },
  [OrderStatus.DELIVERED]: {
    label: 'Entregado',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: Package,
  },
  [OrderStatus.RETURNED]: {
    label: 'Devuelto',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: RotateCcw, // Usa el ícono que prefieras para retornos
  },
}
