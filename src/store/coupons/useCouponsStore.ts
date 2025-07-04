import { CouponType } from '@/types/coupon'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CouponsState {
  coupons: CouponType[]
  setCoupons: (data: CouponType[]) => void
  updateCoupon: (updatedCoupon: CouponType) => void
}

interface AppliedCoupon {
  coupon: CouponType | null
  setCoupon: (coupon: CouponType) => void
  removeCoupon: () => void
  isApplied: () => boolean
}

export const useCouponsStore = create<CouponsState>((set) => ({
  coupons: [],
  setCoupons: (data) => set({ coupons: data }),
  updateCoupon: (updatedCoupon) =>
    set((state) => ({
      coupons: state.coupons.map((coupon) =>
        coupon.id === updatedCoupon.id ? updatedCoupon : coupon
      ),
    })),
}))

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
