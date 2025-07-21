import { apiWithCredentials, apiWithOutCredentials } from '@/actions/api'
import { CouponCreateSchema, CouponUpdateSchema } from '@/schemas/coupons'
import { CouponApplyRequest, CouponResponse, CouponType } from '@/types/coupon'
import axios from 'axios'
import { z } from 'zod'

export const getAllCoupons = async (): Promise<CouponType[]> => {
  try {
    const { data } = await apiWithOutCredentials.get(`/coupons`, {})
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    throw new Error('An unknown error occurred')
  }
}

export const getCoupon = async (couponCode: string) => {
  try {
    const res = await apiWithCredentials.get(`/coupons/${couponCode}`, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const createCoupon = async ({
  newData,
}: {
  newData: z.infer<typeof CouponCreateSchema>
}): Promise<CouponResponse> => {
  try {
    const { data } = await apiWithCredentials.post(`/coupons`, newData)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
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

export const applyCoupon = async (data: CouponApplyRequest) => {
  try {
    const res = await apiWithCredentials.post(`/coupons/apply/`, data)
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
