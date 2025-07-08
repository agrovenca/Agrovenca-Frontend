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
  orderId: string
  productId: string
  quantity: number
  price: string
  createdAt: string
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
