import { destroy, getAll } from '@/actions/settings/categories'
import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import CreateCategory from './Create'
import { Category } from '@/types/category'
import { Button } from '@/components/ui/button'
import { RefreshCwIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getLocalDateTime, truncateText } from '@/lib/utils'
import DeleteDialog from '@/components/blocks/DeleteDialog'
import Update from './Update'
import { Loader } from '@/components/ui/loader'

function CategoriesSettingsPage() {
  const [data, setData] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    const res = await getAll()
    if ('data' in res) {
      console.log(res.data)
      setData(res.data)
    } else {
      console.error('Error al obtener categorías:', res.error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full gap-2">
        <Loader size="md" />
        <span>Cargando...</span>
      </div>
    )
  }
  return (
    <>
      <div className="w-full flex justify-between gap-4 mb-4">
        <div></div>
        <div className="flex items-center gap-2">
          <Button variant={'outline'} onClick={fetchData} className="flex items-center gap-2">
            <RefreshCwIcon />
            <span>Recargar</span>
          </Button>
          <CreateCategory categories={data} setData={setData} />
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
          {data.length > 0 ? (
            data.map((category) => (
              <TableRow key={category.id}>
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
                    <Update category={category} categories={data} setData={setData} />
                    <DeleteDialog action={() => destroy(category.id)} callback={fetchData} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No existen categorías
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}

export default CategoriesSettingsPage
