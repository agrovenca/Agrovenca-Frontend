import { apiWithCredentials, apiWithOutCredentials } from '@/actions/api'
import { UnitySchema } from '@/schemas/unity'
import axios from 'axios'
import { z } from 'zod'

export const getAllUnities = async () => {
  try {
    const res = await apiWithOutCredentials.get(`/unities`, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const create = async (data: z.infer<typeof UnitySchema>) => {
  try {
    const res = await apiWithCredentials.post(`/unities`, data, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const update = async (id: string, data: z.infer<typeof UnitySchema>) => {
  try {
    const res = await apiWithCredentials.patch(`/unities/${id}`, data, {})
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
    const res = await apiWithCredentials.delete(`/unities/${id}`, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
