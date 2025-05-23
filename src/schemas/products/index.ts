import { z } from 'zod'

export const ProductSchema = z
  .object({
    name: z.string().min(2, { message: 'Nombre es requerido' }).max(255),
    description: z.string().max(800),
    price: z.coerce.number().min(0, { message: 'Precio es requerido' }),
    secondPrice: z.coerce.number().min(0).optional(),
    stock: z.coerce.number().min(1, { message: 'Stock es requerido' }),
    freeShipping: z.boolean(),
    videoId: z.string().optional(),

    categoryId: z.string().uuid().min(1, { message: 'Categoría es requerida' }),
    unityId: z.string().uuid().min(1, { message: 'Unidad es requerida' }),
  })
  .refine((data) => data.secondPrice === undefined || data.secondPrice < data.price, {
    message: 'El segundo precio debe ser menor que el precio principal',
    path: ['secondPrice'], // opcional: marca el error sobre `secondPrice`
  })
