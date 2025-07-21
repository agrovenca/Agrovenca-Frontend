import { createCoupon } from '@/actions/coupons'
import { CouponType } from '@/types/coupon'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function useCreateCoupon() {
  const queryClient = useQueryClient()

  const createCouponMutation = useMutation({
    mutationFn: createCoupon,
    onMutate: ({ newData }) => {
      const optimisticCoupon = {
        ...newData,
        id: Math.random().toString(),
        timesUsed: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: newData.expiresAt?.toISOString() ?? undefined,
      }

      queryClient.setQueryData<CouponType[]>(['coupons'], (oldCoupons) => {
        if (!oldCoupons) return [optimisticCoupon]
        return [optimisticCoupon, ...oldCoupons]
      })
      return { optimisticCoupon }
    },
    onSuccess: ({ coupon: newCoupon }, _variables, context) => {
      queryClient.setQueryData<CouponType[]>(['coupons'], (oldCoupons) => {
        if (!oldCoupons) return []

        return oldCoupons.map((cachedCoupon) =>
          cachedCoupon.id === context.optimisticCoupon.id ? newCoupon : cachedCoupon
        )
      })
    },
    onError: (_error, _varibles, context) => {
      queryClient.setQueryData<CouponType[]>(['coupons'], (oldCoupons) => {
        if (!oldCoupons) return []
        return oldCoupons.filter((coupon) => coupon.id !== context?.optimisticCoupon.id)
      })
    },
  })

  return { createCouponMutation }
}

export default useCreateCoupon
