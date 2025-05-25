import { apiWithCredentials } from '@/actions/api'
import { ProductSchema } from '@/schemas/products'
import { ProductResponse } from '@/types/product'
import axios from 'axios'
import { z } from 'zod'

export const getProducts = async (params?: {
  page: number
  search: string
}): Promise<{ data: ProductResponse }> => {
  const url = new URL(apiWithCredentials.defaults.baseURL?.toString() + '/settings/products' || '')

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value.toString())
      }
    })
  }
  try {
    const res = await apiWithCredentials.get(url.toString())
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    throw new Error('An unknown error occurred')
  }
}

export const create = async (data: z.infer<typeof ProductSchema>) => {
  try {
    const res = await apiWithCredentials.post(`/settings/products`, data)
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const destroy = async (id: string) => {
  try {
    const res = await apiWithCredentials.delete(`/settings/products/${id}`, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
