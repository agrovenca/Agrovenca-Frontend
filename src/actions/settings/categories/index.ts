import { apiWithCredentials } from '@/actions/api'
import { CategorySchema } from '@/schemas/category'
import axios from 'axios'
import { z } from 'zod'

export const getAll = async () => {
  try {
    const res = await apiWithCredentials.get(`/settings/categories`, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const create = async (data: z.infer<typeof CategorySchema>) => {
  try {
    const res = await apiWithCredentials.post(`/settings/categories`, data, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const update = async (id: string, data: z.infer<typeof CategorySchema>) => {
  try {
    const res = await apiWithCredentials.patch(`/settings/categories/${id}`, data, {})
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
    const res = await apiWithCredentials.delete(`/settings/categories/${id}`, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
