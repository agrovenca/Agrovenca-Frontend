import { BaseFilterParams, BasePaginatedResponse } from '../shared'
import { ProductImage } from './images'

export interface ProductResponse extends BasePaginatedResponse {
  objects: Product[]
  spaceBaseUrl: string
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
  videoId?: string
  images: ProductImage[]

  userId: string
  categoryId: string
  unityId: string

  createdAt: string
  updatedAt: string
  displayOrder: number
}

export interface ProductFilterParams extends BaseFilterParams {
  categoriesIds?: string[]
  unitiesIds?: string[]
  priceRange?: number[]
  inStockOnly?: boolean
}
