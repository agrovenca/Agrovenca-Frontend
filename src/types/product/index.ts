import { BaseFilterParams } from '../shared'
import { ProductImage } from './images'

export interface ProductResponse {
  objects: Product[]
  page: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextPage: number | null
  previousPage: number | null
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
