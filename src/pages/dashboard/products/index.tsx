import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DownloadIcon, RefreshCwIcon } from 'lucide-react'
import CreateProduct from './Create'
import { exportProducts } from '@/actions/products'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import ExtendedTooltip from '@/components/blocks/ExtendedTooltip'
import ProductsTable from './ProductsTable'
import { useExcelExport } from '@/hooks/useExcelExport'
import { toast } from 'sonner'
import useProducts from '@/hooks/products/useProducts'
import Filters from '@/components/pages/products/Filters'

function ProductsDashboardPage() {
  const [dragAndDropActive, setDragAndDropActive] = useState(false)

  const { productsQuery } = useProducts({})
  const { exportExcel } = useExcelExport()

  const handleExport = async (format: string) => {
    try {
      const res = await exportProducts(format)
      if (res.status === 200) {
        toast.success('Archivo generado correctamente')
      }
      return res
    } catch (error) {
      console.error('Error al exportar los productos:', error)
    }
  }

  return (
    <>
      <div className="w-full flex justify-between gap-6 mb-4">
        <Filters />
        <div className="flex items-center gap-2">
          <CreateProduct />
          <Button
            variant={'outline'}
            onClick={() => productsQuery.refetch()}
            className={'flex items-center gap-2'}
          >
            <RefreshCwIcon />
            <span>Recargar</span>
          </Button>
          {productsQuery.isSuccess && productsQuery.data.objects.length ? (
            <>
              <Button
                variant={'outline'}
                onClick={() => exportExcel(() => handleExport('xlsx'), 'productos.xlsx')}
                className="flex items-center gap-2"
              >
                <DownloadIcon />
                <span>Exportar</span>
              </Button>
              <ExtendedTooltip content={<p>Arrastra los productos y cambia su orden.</p>}>
                <Label
                  htmlFor="editableMode"
                  className={`flex items-center space-x-2 text-sm px-4 py-2 h-9 rounded-md bg-gray-100 border dark:bg-gray-700 ${
                    dragAndDropActive && 'bg-blue-500 text-white hover:bg-blue-600 animate-pulse'
                  }`}
                >
                  <Switch
                    id="editableMode"
                    checked={dragAndDropActive}
                    onClick={() => setDragAndDropActive((prev) => !prev)}
                  />
                  <span>Ordenamiento {dragAndDropActive ? 'activado' : 'desactivado'}</span>
                </Label>
              </ExtendedTooltip>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex gap-6 flex-col sm:flex-row">
        <ProductsTable isDraggable={dragAndDropActive} setIsDraggable={setDragAndDropActive} />
      </div>
    </>
  )
}

export default ProductsDashboardPage
