import { CouponTypes } from '@/types/coupon'
import { z } from 'zod'

export const CouponSchema = z.object({
  code: z
    .string()
    .min(2, { message: 'Código es requerido' })
    .max(50, { message: 'No pueden ser más de 50 caracteres' }),
  description: z.string().max(255, { message: 'No pueden ser más de 255 caracteres' }).optional(),
  discount: z.coerce.number().gte(0, { message: 'No puede ser menor que 0' }),
  active: z.boolean(),
  type: z.nativeEnum(CouponTypes),
  usageLimit: z.coerce.number().gte(0, { message: 'No puede ser menor que 0' }).optional(),
  expiresAt: z.date().min(new Date(), { message: 'No puede ser menor a hoy' }).optional(),
})

export const CouponUpdateSchema = CouponSchema.omit({ code: true }).partial()
