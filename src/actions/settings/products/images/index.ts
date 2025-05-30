import { apiWithCredentials } from '@/actions/api'
import { ProductImageSchema } from '@/schemas/products/images'
import axios from 'axios'
import { z } from 'zod'

export const create = async (productId: string, data: z.infer<typeof ProductImageSchema>) => {
  try {
    const formData = new FormData()
    data.files.forEach((file) => {
      formData.append('files', file)
    })
    const res = await apiWithCredentials.post(`/settings/products/images/${productId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export async function updateProductImagesOrder(
  updatedImages: { id: string; productId: string; displayOrder: number }[]
) {
  try {
    const res = await apiWithCredentials.patch(`/settings/products/images/order/`, {
      updatedImages,
    })
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export const destroy = async (id: string, productId: string) => {
  try {
    const res = await apiWithCredentials.delete(`/settings/products/images/${id}/${productId}`)
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
