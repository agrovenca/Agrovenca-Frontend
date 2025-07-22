import { CouponType } from '@/types/coupon'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppliedCoupon {
  coupon: CouponType | null
  setCoupon: (coupon: CouponType) => void
  removeCoupon: () => void
  isApplied: () => boolean
}

export const useAppliedCouponStore = create<AppliedCoupon>()(
  persist(
    (set, get) => ({
      coupon: null,
      setCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),
      isApplied: () => !!get().coupon,
    }),
    {
      name: 'applied-coupon-storage',
    }
  )
)
