import { apiWithCredentials, apiWithOutCredentials } from '@/actions/api'
import { UnitySchema } from '@/schemas/unity'
import { Unity, UnityResponse } from '@/types/unity'
import axios from 'axios'
import { z } from 'zod'

export const getAllUnities = async (): Promise<Unity[]> => {
  try {
    const { data } = await apiWithOutCredentials.get(`/unities`, {})
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    throw new Error('An unknown error occurred')
  }
}

export const createUnity = async ({
  newData,
}: {
  newData: z.infer<typeof UnitySchema>
}): Promise<UnityResponse> => {
  try {
    const { data } = await apiWithCredentials.post<UnityResponse>(`/unities`, newData)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export const updateUnity = async ({
  id,
  newData,
}: {
  id: string
  newData: z.infer<typeof UnitySchema>
}): Promise<UnityResponse> => {
  try {
    const { data } = await apiWithCredentials.patch<UnityResponse>(`/unities/${id}`, newData)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export const deleteUnity = async ({ id }: { id: string }): Promise<UnityResponse> => {
  try {
    const { data } = await apiWithCredentials.delete(`/unities/${id}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}
