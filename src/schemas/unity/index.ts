import { z } from 'zod'

export const UnitySchema = z.object({
  name: z.string().min(2, { message: 'Nombre es requerido' }).max(50),
  description: z.string().max(255).optional(),
})
