import { CouponType } from '@/types/coupon'
import { create } from 'zustand'

interface CouponsState {
  coupons: CouponType[]
  setCoupons: (data: CouponType[]) => void
  updateCoupon: (updatedCoupon: CouponType) => void
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
