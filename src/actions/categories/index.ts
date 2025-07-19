import { apiWithCredentials, apiWithOutCredentials } from '@/actions/api'
import { CategorySchema } from '@/schemas/category'
import { Category, CategoryResponse } from '@/types/category'
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
}): Promise<CategoryResponse> => {
  try {
    const { data } = await apiWithCredentials.post<CategoryResponse>(`/categories`, newData)
    return data
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
}): Promise<CategoryResponse> => {
  try {
    const { data } = await apiWithCredentials.patch<CategoryResponse>(`/categories/${id}`, newData)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export const deleteCategory = async ({ id }: { id: string }): Promise<CategoryResponse> => {
  try {
    const { data } = await apiWithCredentials.delete<CategoryResponse>(`/categories/${id}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}
