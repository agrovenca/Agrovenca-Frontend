import axios from 'axios'
import { apiWithCredentials } from '../api'
import { OrderCreateSchema } from '@/schemas/orders'
import z from 'zod'
import { Order } from '@/types/order'

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

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const { data } = await apiWithCredentials.get(`/orders`, {})
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    throw new Error('An unknown error occurred')
  }
}
