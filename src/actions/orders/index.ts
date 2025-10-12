import axios from 'axios'
import { apiWithCredentials } from '../api'
import { OrderCreateSchema, OrderPaymentSchema, OrderAdminUpdateSchema } from '@/schemas/orders'
import z from 'zod'
import { Order, OrderPaymentResponse, OrderResponse, OrdersPaginatedResponse } from '@/types/order'
import { BaseFilterParams } from '@/types/shared'

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

export const getAllOrders = async (params?: BaseFilterParams): Promise<OrdersPaginatedResponse> => {
  const url = new URL(apiWithCredentials.defaults.baseURL?.toString() + '/orders' || '')

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString())
      }
    })
  }

  try {
    const { data } = await apiWithCredentials.get<OrdersPaginatedResponse>(url.toString())
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    throw new Error('An unknown error occurred')
  }
}

export const registerPayment = async ({
  userId,
  orderId,
  newData,
}: {
  userId: string
  orderId: string
  newData: z.infer<typeof OrderPaymentSchema>
}): Promise<OrderPaymentResponse> => {
  try {
    const formData = new FormData()
    formData.append('receipt', newData.receipt)
    const { data } = await apiWithCredentials.post<OrderPaymentResponse>(
      `/orders/${userId}/${orderId}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export const updateAdminOrder = async ({
  id,
  newData,
}: {
  id: string
  newData: z.infer<typeof OrderAdminUpdateSchema>
}): Promise<OrderResponse> => {
  try {
    const { data } = await apiWithCredentials.patch<OrderResponse>(`/orders/status/${id}`, newData)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}
