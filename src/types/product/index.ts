import { BaseFilterParams, BasePaginatedResponse } from '../shared'
import { ProductImage } from './images'

export interface ProductsPaginatedResponse {
  objects: Product[]
  pagination: BasePaginatedResponse
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  secondPrice?: number
  stock: number
  freeShipping: boolean
  videoId?: string | null
  images: ProductImage[]

  userId: string
  categoryId: string
  unityId: string

  createdAt: string
  updatedAt: string
  displayOrder: number
}

export interface ProductFilterParams extends BaseFilterParams {
  categoriesId?: string[]
  unitiesId?: string[]
  priceRange?: number[]
  inStockOnly?: boolean
}

export interface ProductResponse {
  product: Product
  message: string
}

export interface ProductReorderResponse {
  result: Product[]
  message: string
}
