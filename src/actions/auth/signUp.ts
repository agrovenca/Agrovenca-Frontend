import { RegisterSchema } from '@/schemas/auth'
import { z } from 'zod'
import axios from 'axios'
import { apiWithCredentials } from '../api'

export const signUp = async (data: z.infer<typeof RegisterSchema>) => {
  try {
    const res = await apiWithCredentials.post(`/auth/register`, data, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
