import { OrderStatus, PaymentStatus } from '@/types/order'
import { z } from 'zod'

const MAX_FILE_SIZE = 1024 * 1024 * 5
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export const OrderCreateSchema = z.object({
  id: z.string().regex(/^ORD-\d{8}$/),
  couponId: z.string().optional(),
  shippingAddressId: z.string().uuid(),
  products: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      categoryId: z.string().uuid().optional(),
    })
  ),
  subtotal: z.number().positive(),
  discount: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  total: z.number().positive(),
})

export const OrderPaymentSchema = z.object({
  receipt: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'La imagen debe ser de 5MB o menos',
    })
    .refine((file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type), {
      message: 'Solo los formatos .jpg, .jpeg y .png están permitidos.',
    }),
})

export const OrderAdminUpdateSchema = z.object({
  orderStatus: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
})
