import { deleteCoupon } from '@/actions/coupons'
import { CouponType } from '@/types/coupon'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function useDeleteCoupon() {
  const queryClient = useQueryClient()
  const deleteCouponMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteCoupon({ id }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['coupons'] })
      const previousCoupons = queryClient.getQueryData<CouponType[]>(['coupons'])

      queryClient.setQueryData<CouponType[]>(['coupons'], (oldCoupons) => {
        if (!oldCoupons) return []
        return oldCoupons.filter((coupon) => coupon.id !== id)
      })
      return { previousCoupons }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCoupons) {
        queryClient.setQueryData<CouponType[]>(['coupons'], context.previousCoupons)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
    },
  })

  return { deleteCouponMutation }
}

export default useDeleteCoupon
