import axios from 'axios'
import { apiWithCredentials } from '../api'
import { OrderCreateSchema } from '@/schemas/orders'
import z from 'zod'

export const createOrder = async (data: z.infer<typeof OrderCreateSchema>) => {
  try {
    const res = await apiWithCredentials.post(`/orders`, data, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
