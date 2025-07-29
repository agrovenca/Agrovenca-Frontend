import axios from 'axios'
import { apiWithCredentials } from '../api'
import { z } from 'zod'
import { AddressCreateSchema, AddressUpdateSchema } from '@/schemas/products/shippingAddress'
import { ShippingAddress } from '@/types/shippingAddress'

export const getShippingAddresses = async ({
  userId,
}: {
  userId: string
}): Promise<ShippingAddress[]> => {
  try {
    const { data } = await apiWithCredentials.get(`/shippings/${userId}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    throw new Error('An unknown error occurred')
  }
}

export const createAddress = async ({ data }: { data: z.infer<typeof AddressCreateSchema> }) => {
  try {
    const res = await apiWithCredentials.post(`/shippings`, data)
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const updateAddress = async ({
  pk,
  data,
}: {
  pk: string
  data: z.infer<typeof AddressUpdateSchema>
}) => {
  try {
    const res = await apiWithCredentials.patch(`/shippings/${pk}`, data)
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const deleteAddress = async ({ pk }: { pk: string }) => {
  try {
    const res = await apiWithCredentials.delete(`/shippings/${pk}`)
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
