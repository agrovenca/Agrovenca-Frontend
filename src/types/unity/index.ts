export interface Unity {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  _count: { products: number }
}

export interface UnityResponse {
  unity: Unity
  message: string
}
