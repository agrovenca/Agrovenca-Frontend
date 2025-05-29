import { z } from 'zod'

const MAX_FILE_SIZE = 1024 * 1024 * 5
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const ProductImageSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, { message: 'Debes subir al menos una imagen.' })
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      'La imagen debe ser de 5MB o menos'
    )
    .refine(
      (files) => files.every((file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)),
      'Solo los formatos .jpg, .jpeg, .png and .webp están permitidos.'
    ),
})
