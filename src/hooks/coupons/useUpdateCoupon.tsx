import { updateCoupon } from '@/actions/coupons'
import { CouponUpdateSchema } from '@/schemas/coupons'
import { CouponType } from '@/types/coupon'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

function useUpdateCoupon() {
  const queryClient = useQueryClient()
  const updateCouponMutation = useMutation({
    mutationFn: ({ id, newData }: { id: string; newData: z.infer<typeof CouponUpdateSchema> }) =>
      updateCoupon({ id, newData }),
    onMutate: async ({ id, newData }) => {
      await queryClient.cancelQueries({ queryKey: ['coupons'] })
      const previousCoupons = queryClient.getQueryData<CouponType[]>(['coupons'])

      queryClient.setQueryData<CouponType[]>(['coupons'], (oldCoupons) => {
        if (!oldCoupons) return []

        return oldCoupons.map((coupon) => {
          if (coupon.id !== id) return coupon

          // Normalizamos el campo `expiresAt` si es Date
          const updatedCoupon = {
            ...coupon,
            ...newData,
            expiresAt:
              newData.expiresAt instanceof Date
                ? newData.expiresAt.toISOString()
                : newData.expiresAt,
          }

          return updatedCoupon
        })
      })
      return { previousCoupons }
    },
    onError: (_, __, context) => {
      if (context?.previousCoupons) {
        queryClient.setQueryData(['coupons'], context.previousCoupons)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
    },
  })

  return { updateCouponMutation }
}

export default useUpdateCoupon
