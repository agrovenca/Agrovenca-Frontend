import axios from 'axios'
import { apiWithCredentials } from '../api'
import { z } from 'zod'
import { AddressCreateSchema, AddressUpdateSchema } from '@/schemas/products/shippingAddress'
import { ShippingAddress, ShippingResponse } from '@/types/shippingAddress'

export const getShippingAddresses = async ({
  userId,
}: {
  userId: string
}): Promise<ShippingAddress[]> => {
  try {
    const { data } = await apiWithCredentials.get<ShippingAddress[]>(`/shippings/${userId}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export const createAddress = async ({
  newData,
}: {
  newData: z.infer<typeof AddressCreateSchema>
}): Promise<ShippingResponse> => {
  try {
    const { data } = await apiWithCredentials.post<ShippingResponse>(`/shippings`, newData)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export const updateAddress = async ({
  pk,
  newData,
}: {
  pk: string
  newData: z.infer<typeof AddressUpdateSchema>
}): Promise<ShippingResponse> => {
  try {
    const { data } = await apiWithCredentials.patch(`/shippings/${pk}`, newData)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export const deleteAddress = async ({ pk }: { pk: string }): Promise<ShippingResponse> => {
  try {
    const { data } = await apiWithCredentials.delete<ShippingResponse>(`/shippings/${pk}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}
