import { apiWithCredentials, apiWithOutCredentials } from '@/actions/api'
import { ProductSchema, ProductUpdateSchema } from '@/schemas/products'
import { CartItem } from '@/types/cart'
import {
  Product,
  ProductsPaginatedResponse,
  ProductFilterParams,
  ProductResponse,
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

export const getProduct = async ({ slug }: { slug: string }): Promise<Product> => {
  try {
    const { data } = await apiWithOutCredentials.get<{ product: Product; message: string }>(
      `/products/${slug}`
    )
    return data.product
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

export const destroy = async (id: string) => {
  try {
    const res = await apiWithCredentials.delete(`/products/${id}`, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}

export async function updateProductOrder(updatedProducts: { id: string; displayOrder: number }[]) {
  try {
    const res = await apiWithCredentials.patch(`/products/order/`, {
      updatedProducts,
    })
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
