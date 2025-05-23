import { destroy, getAll } from '@/actions/settings/unities'
import { Loader } from '@/components/ui/loader'
import { Unity } from '@/types/unity'
import { useEffect, useState } from 'react'
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
import DeleteDialog from '@/components/blocks/DeleteDialog'
import CreateUnity from './Create'
import Update from './Update'

function UnitiesSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<Unity[]>([])

  const fetchData = async () => {
    setIsLoading(true)
    const res = await getAll()
    if ('data' in res) {
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
          <CreateUnity unities={data} setData={setData} />
        </div>
      </div>
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead>Actualizado</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((unity) => (
              <TableRow key={unity.id}>
                <TableCell className="font-medium">{unity.name}</TableCell>
                <TableCell className="italic">{truncateText(unity.description, 25)}</TableCell>
                <TableCell>{getLocalDateTime(unity.createdAt, ['es-ve'])}</TableCell>
                <TableCell>{getLocalDateTime(unity.updatedAt, ['es-ve'])}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2">
                    <Update unity={unity} unities={data} setData={setData} />
                    <DeleteDialog action={() => destroy(unity.id)} callback={fetchData} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No existen unidades
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}

export default UnitiesSettingsPage
