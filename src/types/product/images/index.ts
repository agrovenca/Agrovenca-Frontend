export interface ProductImage {
  id: string
  s3Key: string
  createdAt: string
  displayOrder: number
  productId: string
}

export interface ProductImageCreateResponse {
  images: ProductImage[]
  productId: string
  message: string
}

export interface ProductImageResponse {
  images: ProductImage[]
  message: string
}
