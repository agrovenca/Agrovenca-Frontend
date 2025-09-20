import { z } from 'zod'
import { apiWithOutCredentials } from '../api'
import {
  ForgotPasswordSchema,
  ResetPasswordValidateSchema,
  ResetPasswordConfirmSchema,
} from '@/schemas/auth'
import axios from 'axios'

interface ResetPasswordEmailProps {
  data: z.infer<typeof ForgotPasswordSchema>
  captchaToken: string | null
}

export const resetPasswordEmail = async ({ data, captchaToken }: ResetPasswordEmailProps) => {
  try {
    const res = await apiWithOutCredentials.post('/auth/reset-password-send', {
      ...data,
      captchaToken,
    })
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const resetPasswordValidate = async (data: z.infer<typeof ResetPasswordValidateSchema>) => {
  try {
    const res = await apiWithOutCredentials.post(`/auth/reset-password-validate/`, data)
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const resetPasswordConfirm = async (
  code: string,
  data: z.infer<typeof ResetPasswordConfirmSchema>
) => {
  try {
    const res = await apiWithOutCredentials.patch(`/auth/reset-password-confirm/${code}`, data)
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
