import { z } from 'zod'

export const OrderCreateSchema = z.object({
  id: z.string().regex(/^ORD-\d{8}$/),
  couponId: z.string().optional(),
  shippingAddressId: z.string().uuid(),
  products: z.array(
    z.object({
      id: z.string().uuid(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
      categoryId: z.string().uuid().optional(),
    })
  ),
  subtotal: z.number().positive(),
  discount: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  total: z.number().positive(),
})
