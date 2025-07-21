export enum CouponTypes {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export interface CouponType {
  id: string
  code: string
  description?: string
  discount: number
  active: boolean
  type: CouponTypes
  usageLimit?: number
  timesUsed: number
  minPurchase?: number
  validCategories?: string[]
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface CouponApplyRequest {
  couponCode: string
  orderNumber: string
  products: {
    id: string
    quantity: number
    price: number
    categoryId: string
  }[]
  subtotal: number
}

export interface CouponResponse {
  coupon: CouponType
  message: string
}
