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
  expiresAt?: string
  createdAt: string
  updatedAt: string
}
