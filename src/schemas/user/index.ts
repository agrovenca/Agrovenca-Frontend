import { z } from 'zod'

export const ProfileSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }).max(20),
  lastName: z.string().min(2, { message: 'Last name is required' }).max(20),
})

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    passwordConfirm: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  })
  .refine((data) => data.currentPassword !== data.password, {
    message: 'The new password must be different from the old one.',
    path: ['password'],
  })

export const UserAccountSettingsSchema = z.object({
  isActive: z.boolean(),
  role: z.enum(['client', 'mod']).optional(),
})
