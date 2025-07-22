import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DownloadIcon, RefreshCwIcon, Search } from 'lucide-react'
import CreateProduct from './Create'
import { exportProducts } from '@/actions/products'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import ExtendedTooltip from '@/components/blocks/ExtendedTooltip'
import ProductsTable from './ProductsTable'
import { useExcelExport } from '@/hooks/useExcelExport'
import { toast } from 'sonner'
// import { FiltersBar } from './Filters'
import { Input } from '@/components/ui/input'
import useProducts from '@/hooks/products/useProducts'
import { useDebounce } from 'use-debounce'

function ProductsDashboardPage() {
  const [search, setSearch] = useState('')
  const [limit, _setLimit] = useState(12)
  const [dragAndDropActive, setDragAndDropActive] = useState(false)
  const [debouncedSearch] = useDebounce(search, 500)

  const { exportExcel } = useExcelExport()

  const { productsQuery } = useProducts({ limit, search: debouncedSearch })

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
      <div className="w-full flex justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filtrar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <CreateProduct />
          <Button
            variant={'outline'}
            onClick={() => exportExcel(() => handleExport('xlsx'), 'productos.xlsx')}
            className="flex items-center gap-2"
          >
            <DownloadIcon />
            <span>Exportar</span>
          </Button>
          <Button
            variant={'outline'}
            onClick={() => productsQuery.refetch()}
            className="flex items-center gap-2"
          >
            <RefreshCwIcon />
            <span>Recargar</span>
          </Button>
          {productsQuery.data && productsQuery.data.objects.length && (
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
          )}
        </div>
      </div>

      <div className="flex gap-6 flex-col sm:flex-row">
        {/* <FiltersBar
          limit={limit}
          setSearch={setSearch}
          search={search}
          setLimit={setLimit}
          recordsPerPage={[1, 2, 3]}
        /> */}

        <ProductsTable
          limit={limit}
          search={debouncedSearch}
          isDraggable={dragAndDropActive}
          setIsDraggable={setDragAndDropActive}
        />
      </div>
    </>
  )
}

export default ProductsDashboardPage
