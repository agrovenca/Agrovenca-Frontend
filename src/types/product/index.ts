export interface ProductImage {
  id: string
  url: string
  createdAt: string

  productId: string
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
