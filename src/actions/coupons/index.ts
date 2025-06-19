import { apiWithCredentials, apiWithOutCredentials } from '@/actions/api'
import { CouponCreateSchema, CouponUpdateSchema } from '@/schemas/coupons'
import axios from 'axios'
import { z } from 'zod'

export const getAll = async () => {
  try {
    const res = await apiWithOutCredentials.get(`/coupons`, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const create = async (data: z.infer<typeof CouponCreateSchema>) => {
  try {
    const res = await apiWithCredentials.post(`/coupons`, data, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const update = async (id: string, data: z.infer<typeof CouponUpdateSchema>) => {
  try {
    const res = await apiWithCredentials.patch(`/coupons/${id}`, data, {})
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
    const res = await apiWithCredentials.delete(`/coupons/${id}`, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
