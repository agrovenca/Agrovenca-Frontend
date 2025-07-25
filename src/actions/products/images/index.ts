import { apiWithCredentials } from '@/actions/api'
import { ProductImageSchema } from '@/schemas/products/images'
import { ProductImageCreateResponse } from '@/types/product/images'
import axios from 'axios'
import { z } from 'zod'

export const createProductImage = async ({
  productId,
  newImages,
}: {
  productId: string
  newImages: z.infer<typeof ProductImageSchema>
}): Promise<ProductImageCreateResponse> => {
  try {
    const formData = new FormData()
    newImages.files.forEach((file) => {
      formData.append('files', file)
    })
    const { data } = await apiWithCredentials.post<ProductImageCreateResponse>(
      `/products/images/${productId}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export async function updateProductImagesOrder(
  updatedImages: { id: string; productId: string; displayOrder: number }[]
) {
  try {
    const res = await apiWithCredentials.patch(`/products/images/order/`, {
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
    const res = await apiWithCredentials.delete(`/products/images/${id}/${productId}`)
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
