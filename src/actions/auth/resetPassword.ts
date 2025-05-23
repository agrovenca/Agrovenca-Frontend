import { z } from 'zod'
import { apiWithOutCredentials } from '../api'
import {
  ForgotPasswordSchema,
  ResetPasswordValidateSchema,
  ResetPasswordConfirmSchema,
} from '@/schemas/auth'
import axios from 'axios'

export const resetPasswordEmail = async (data: z.infer<typeof ForgotPasswordSchema>) => {
  try {
    const res = await apiWithOutCredentials.post('/auth/reset-password-send', data, {})
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
