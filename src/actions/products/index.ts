import { apiWithCredentials, apiWithOutCredentials } from '@/actions/api'
import { ProductSchema, ProductUpdateSchema } from '@/schemas/products'
import { CartItem } from '@/types/cart'
import {
  ProductsPaginatedResponse,
  ProductFilterParams,
  ProductResponse,
  ProductReorderResponse,
} from '@/types/product'
import axios from 'axios'
import { z } from 'zod'

export const getProducts = async (
  params?: ProductFilterParams
): Promise<ProductsPaginatedResponse> => {
  const url = new URL(apiWithOutCredentials.defaults.baseURL?.toString() + '/products' || '')

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString())
      }
    })
  }
  try {
    const { data } = await apiWithOutCredentials.get<ProductsPaginatedResponse>(url.toString())
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    throw new Error('An unknown error occurred')
  }
}

export const getProduct = async ({ slug }: { slug: string }): Promise<ProductResponse> => {
  try {
    const { data } = await apiWithOutCredentials.get<ProductResponse>(`/products/${slug}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    throw new Error('An unknown error occurred')
  }
}

export const validateCart = async ({ items }: { items: Omit<CartItem, 'product'>[] }) => {
  try {
    const res = await apiWithOutCredentials.post(`/products/validateCart`, { items })
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    throw new Error('An unknown error occurred')
  }
}

export const exportProducts = async (format: string) => {
  try {
    const res = await apiWithCredentials.get(`/products/export/${format}`, {
      responseType: 'blob',
    })
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    throw new Error('An unknown error occurred')
  }
}

export const createProduct = async ({
  newData,
}: {
  newData: z.infer<typeof ProductSchema>
}): Promise<ProductResponse> => {
  try {
    const { data } = await apiWithCredentials.post<ProductResponse>(`/products`, newData)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export const updateProduct = async ({
  id,
  newData,
}: {
  id: string
  newData: z.infer<typeof ProductUpdateSchema>
}): Promise<ProductResponse> => {
  try {
    const { data } = await apiWithCredentials.patch<ProductResponse>(`/products/${id}`, newData)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export const deleteProduct = async ({ id }: { id: string }): Promise<ProductResponse> => {
  try {
    const { data } = await apiWithCredentials.delete<ProductResponse>(`/products/${id}`, {})
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export async function updateProductsOrder(updatedProducts: { id: string; displayOrder: number }[]) {
  try {
    const { data } = await apiWithCredentials.patch<ProductReorderResponse>(`/products/order/`, {
      updatedProducts,
    })
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}

export async function updateProductOrder({
  id,
  displayOrder,
}: {
  id: string
  displayOrder: number
}) {
  try {
    const { data } = await apiWithCredentials.patch(`/products/orderManual/${id}`, {
      displayOrder,
    })
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}
