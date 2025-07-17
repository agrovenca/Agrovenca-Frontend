import { destroy } from '@/actions/categories'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import CreateCategory from './Create'
import { Button } from '@/components/ui/button'
import { RefreshCwIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getLocalDateTime, truncateText } from '@/lib/utils'
import DeleteDialog from '@/components/blocks/DeleteDialog'
import Update from './Update'
import { Loader } from '@/components/ui/loader'
import useCategories from '@/hooks/categories/useCategories'

function CategoriesDashboardPage() {
  const { categoriesQuery } = useCategories()

  return (
    <>
      <div className="w-full flex justify-between gap-4 mb-4">
        <div></div>
        <div className="flex items-center gap-2">
          <Button
            variant={'outline'}
            onClick={() => categoriesQuery.refetch()}
            className="flex items-center gap-2"
          >
            <RefreshCwIcon />
            <span>Recargar</span>
          </Button>
          <CreateCategory />
        </div>
      </div>
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead>Actualizado</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(categoriesQuery.isPending || categoriesQuery.isFetching) && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <div className="flex items-center justify-center h-full w-full gap-2">
                  <Loader size="md" />
                  <span>Cargando...</span>
                </div>
              </TableCell>
            </TableRow>
          )}
          {categoriesQuery.isSuccess && categoriesQuery.data.length ? (
            categoriesQuery.data.map((category) => (
              <TableRow key={category.id} className="font-serif">
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="italic">{truncateText(category.description, 25)}</TableCell>
                <TableCell>{getLocalDateTime(category.createdAt, ['es-ve'])}</TableCell>
                <TableCell>{getLocalDateTime(category.updatedAt, ['es-ve'])}</TableCell>
                <TableCell>
                  <Badge variant={category.active ? 'default' : 'outline'}>
                    {category.active ? 'Activa' : 'Inactiva'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2">
                    <Update category={category} />
                    <DeleteDialog
                      action={() => destroy(category.id)}
                      callback={categoriesQuery.refetch}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No existen categorías
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}

export default CategoriesDashboardPage
