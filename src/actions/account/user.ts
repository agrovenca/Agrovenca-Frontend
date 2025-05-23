import { ChangePasswordSchema, ProfileSchema } from '@/schemas/user'
import axios from 'axios'
import { z } from 'zod'
import { apiWithCredentials } from '../api'

export const updateUser = async (id: string, data: z.infer<typeof ProfileSchema>) => {
  try {
    const res = await apiWithCredentials.patch(`/users/${id}`, data, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const changePassword = async (id: string, data: z.infer<typeof ChangePasswordSchema>) => {
  try {
    const res = await apiWithCredentials.patch(`/users/change-password/${id}`, data, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
