import { Loader } from '@/components/ui/loader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { RefreshCwIcon } from 'lucide-react'
import { getLocalDateTime, truncateText } from '@/lib/utils'
import { CouponTypes } from '@/types/coupon'
import { Badge } from '@/components/ui/badge'
import CreateCoupon from './Create'
import { destroy } from '@/actions/coupons'
import UpdateCoupon from './Update'
import DeleteDialog from '@/components/blocks/DeleteDialog'
import useCoupons from '@/hooks/coupons/useCoupons'

function CouponsDashboardPage() {
  const { couponsQuery } = useCoupons()

  return (
    <>
      <div className="w-full flex justify-between gap-4 mb-4">
        <div></div>
        <div className="flex items-center gap-2">
          <Button
            variant={'outline'}
            onClick={() => couponsQuery.refetch()}
            className="flex items-center gap-2 cursor-pointer"
          >
            <RefreshCwIcon />
            <span>Recargar</span>
          </Button>
          <CreateCoupon />
        </div>
      </div>
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Código</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Descuento</TableHead>
            <TableHead>Límite de uso</TableHead>
            <TableHead>Veces usado</TableHead>
            <TableHead>Expira</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead>Actualizado</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {couponsQuery.isFetching && (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                <div className="flex items-center justify-center h-full w-full gap-2">
                  <Loader size="md" />
                  <span>Cargando...</span>
                </div>
              </TableCell>
            </TableRow>
          )}
          {couponsQuery.data && couponsQuery.data.length ? (
            couponsQuery.data.map((coupon) => (
              <TableRow key={coupon.id} className="font-serif">
                <TableCell className="font-medium">{coupon.code}</TableCell>
                <TableCell className="italic">{truncateText(coupon.description, 20)}</TableCell>
                <TableCell>
                  <Badge variant={coupon.active ? 'default' : 'destructive'}>
                    {coupon.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge>
                    {coupon.type === CouponTypes.PERCENTAGE
                      ? `${coupon.discount} %`
                      : `$${coupon.discount}`}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge>{coupon.usageLimit ? `${coupon.usageLimit} veces` : 'Sín límite'}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={coupon.timesUsed === 0 ? 'outline' : 'default'}>
                    {coupon.timesUsed === 0 ? 'No usado' : `${coupon.timesUsed} veces`}
                  </Badge>
                </TableCell>
                <TableCell>
                  {coupon.expiresAt ? getLocalDateTime(coupon.expiresAt, ['es-ve']) : 'No expira'}
                </TableCell>
                <TableCell>{getLocalDateTime(coupon.createdAt, ['es-ve'], true)}</TableCell>
                <TableCell>{getLocalDateTime(coupon.updatedAt, ['es-ve'])}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2">
                    <UpdateCoupon coupon={coupon} />
                    <DeleteDialog
                      action={() => destroy(coupon.id)}
                      callback={couponsQuery.refetch}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                No existen cupones
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}

export default CouponsDashboardPage
