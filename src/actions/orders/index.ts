import axios from 'axios'
import { apiWithCredentials } from '../api'
import { OrderCreateSchema } from '@/schemas/orders'
import z from 'zod'
import { Order, OrderResponse } from '@/types/order'

export const createOrder = async ({
  newData,
}: {
  newData: z.infer<typeof OrderCreateSchema>
}): Promise<OrderResponse> => {
  try {
    const { data } = await apiWithCredentials.post<OrderResponse>(`/orders`, newData)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export const getOrdersByUser = async ({ userId }: { userId: string }): Promise<Order[]> => {
  try {
    const { data } = await apiWithCredentials.get<Order[]>(`/orders/${userId}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    throw new Error('An unknown error occurred')
  }
}

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const { data } = await apiWithCredentials.get<Order[]>(`/orders`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    throw new Error('An unknown error occurred')
  }
}
