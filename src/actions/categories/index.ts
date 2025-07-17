import { apiWithCredentials, apiWithOutCredentials } from '@/actions/api'
import { CategorySchema } from '@/schemas/category'
import { Category } from '@/types/category'
import axios from 'axios'
import { z } from 'zod'

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await apiWithOutCredentials.get(`/categories`, {})
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    throw new Error('An unknown error occurred')
  }
}

export const create = async (data: z.infer<typeof CategorySchema>) => {
  try {
    const res = await apiWithCredentials.post(`/categories`, data, {})
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
    const res = await apiWithCredentials.patch(`/categories/${id}`, data, {})
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
    const res = await apiWithCredentials.delete(`/categories/${id}`, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
