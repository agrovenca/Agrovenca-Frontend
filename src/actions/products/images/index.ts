import { apiWithCredentials } from '@/actions/api'
import { ProductImageSchema } from '@/schemas/products/images'
import {
  ProductImageCreateResponse,
  ProductImageResponse,
  ProductImagesReorderResponse,
} from '@/types/product/images'
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
  productId: string,
  updatedImages: { id: string; displayOrder: number }[]
): Promise<ProductImagesReorderResponse> {
  try {
    const { data } = await apiWithCredentials.patch<ProductImagesReorderResponse>(
      `/products/images/order/${productId}`,
      {
        updatedImages,
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

export const deleteProductImage = async ({
  id,
  productId,
}: {
  id: string
  productId: string
}): Promise<ProductImageResponse> => {
  try {
    const { data } = await apiWithCredentials.delete<ProductImageResponse>(
      `/products/images/${id}/${productId}`
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
