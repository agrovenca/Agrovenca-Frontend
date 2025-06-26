import axios from 'axios'
import { apiWithCredentials } from '../api'
import { z } from 'zod'
import { ShippingAddressSchema } from '@/schemas/products/shippingAddress'

export const getShippingAddresses = async () => {
  try {
    const res = await apiWithCredentials.get(`/shippings`)
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const createShippingAddress = async ({
  data,
}: {
  data: z.infer<typeof ShippingAddressSchema>
}) => {
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
