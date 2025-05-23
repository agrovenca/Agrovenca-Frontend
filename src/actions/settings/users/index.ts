import { apiWithCredentials } from '@/actions/api'
import { UserAccountSettingsSchema } from '@/schemas/user'
import axios from 'axios'
import { z } from 'zod'

export const getAll = async (params?: { page: number; search: string }, signal?: AbortSignal) => {
  const url = new URL(apiWithCredentials.defaults.baseURL?.toString() + '/users' || '')

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value.toString())
      }
    })
  }

  try {
    const res = await apiWithCredentials.get(url.toString(), {
      signal,
    })
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_CANCELED') {
        console.warn('Request canceled')
      }
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const updateAccountOptions = async (
  id: string,
  data: z.infer<typeof UserAccountSettingsSchema>
) => {
  try {
    const res = await apiWithCredentials.patch(
      `/settings/users/change-account-option/${id}`,
      data,
      {}
    )
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_CANCELED') {
        console.warn('Request canceled')
      }
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
