export interface ProductImage {
  id: string
  s3Key: string
  createdAt: string
  productId: string
  displayOrder: number
}

export interface ProductImageCreateResponse {
  message: string
  productId: string
  images: ProductImage[]
}

export interface ProductImageResponse {
  message: string
  images: ProductImage[]
}

export interface ProductImagesReorderResponse {
  message: string
  images: ProductImage[]
}
