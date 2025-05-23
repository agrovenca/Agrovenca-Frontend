import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
})

// TODO
export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(2, { message: 'Name is required' }).max(20),
  lastName: z.string().min(2, { message: 'Last name is required' }).max(20),
  passwordConfirm: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Passwords do not match',
  path: ['passwordConfirm'],
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }),
})

export const ResetPasswordValidateSchema = z.object({
  code: z.string().min(8, { message: 'El código de seguridad es requerido' }).max(8),
})

export const ResetPasswordConfirmSchema = z
  .object({
    newPassword: z.string().min(6, {
      message: 'La contraseña debe tener al menos 6 caracteres de largo',
    }),
    newPasswordConfirm: z.string().min(6, {
      message: 'La contraseña debe tener al menos 6 caracteres de largo',
    }),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['newPasswordConfirm'],
  })
