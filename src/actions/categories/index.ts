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

export const createCategory = async ({
  newData,
}: {
  newData: z.infer<typeof CategorySchema>
}): Promise<Category> => {
  try {
    const { data } = await apiWithCredentials.post<{ category: Category; message: string }>(
      `/categories`,
      newData
    )
    return data.category
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export const updateCategory = async ({
  id,
  newData,
}: {
  id: string
  newData: z.infer<typeof CategorySchema>
}): Promise<Category> => {
  try {
    const { data } = await apiWithCredentials.patch<{ category: Category; message: string }>(
      `/categories/${id}`,
      newData
    )
    return data.category
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export const deleteCategory = async ({ id }: { id: string }): Promise<Category> => {
  try {
    const { data } = await apiWithCredentials.delete<{ category: Category; message: string }>(
      `/categories/${id}`
    )
    return data.category
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}
