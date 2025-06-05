import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DownloadIcon, RefreshCwIcon, Search } from 'lucide-react'
import { Loader } from '@/components/ui/loader'
import CreateProduct from './Create'
import { getAllCategories } from '@/actions/categories'
import { getAllUnities } from '@/actions/unities'
import { exportProducts, getProducts } from '@/actions/products'
import { usePaginationStore } from '@/store/shared/usePaginationStore'
import { useProductsStore } from '@/store/products/useProductsStore'
import { useUnitiesStore } from '@/store/unities/useUnitiesStore'
import { useCategoriesStore } from '@/store/categories/useCategoriesStore'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import ExtendedTooltip from '@/components/blocks/ExtendedTooltip'
import ProductsTable from './ProductsTable'
import { useExcelExport } from '@/hooks/useExcelExport'
import { toast } from 'sonner'
import { ProductFilterParams } from '@/types/product'
import { FiltersBar } from './Filters'
import { Input } from '@/components/ui/input'

function ProductsDashboardPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [dragAndDropActive, setDragAndDropActive] = useState(false)

  const { exportExcel } = useExcelExport()

  const products = useProductsStore((state) => state.products)
  const setProducts = useProductsStore((state) => state.setProducts)
  const deleteProduct = useProductsStore((state) => state.deleteProduct)
  const setUnities = useUnitiesStore((state) => state.setUnities)
  const setCategories = useCategoriesStore((state) => state.setCategories)
  const setPaginationData = usePaginationStore((state) => state.setPaginationData)

  const fetchData = useCallback(
    async (params?: ProductFilterParams) => {
      setIsLoading(true)
      try {
        const { data } = await getProducts(params)
        setProducts(data.objects)
        setPaginationData({ ...data })
      } catch (error) {
        console.error('Error al obtener productos', error)
      } finally {
        setIsLoading(false)
      }
    },
    [setProducts, setPaginationData]
  )

  const getAssociatedData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [categoriesResponse, unitiesResponse] = await Promise.all([
        getAllCategories(),
        getAllUnities(),
      ])
      setCategories(categoriesResponse.data)
      setUnities(unitiesResponse.data)
    } catch (error) {
      console.error('Error al obtener categorias y unidades', error)
    } finally {
      setIsLoading(false)
    }
  }, [setUnities, setCategories])

  useEffect(() => {
    fetchData({ limit, page })
  }, [fetchData, limit, page])

  useEffect(() => {
    getAssociatedData()
  }, [getAssociatedData])

  const handleDelete = async (productId: string) => {
    try {
      deleteProduct(productId)
      await fetchData({ page, search, limit })
    } catch (error) {
      console.error('Error al eliminar el producto:', error)
    }
  }

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
            onClick={() => fetchData({ page, search, limit })}
            className="flex items-center gap-2"
          >
            <RefreshCwIcon />
            <span>Recargar</span>
          </Button>
          {products.length > 0 && (
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
        <FiltersBar
          limit={limit}
          setSearch={setSearch}
          search={search}
          setLimit={setLimit}
          recordsPerPage={[1, 2, 3]}
          fetchProducts={fetchData}
        />

        <ProductsTable
          setPage={setPage}
          isDraggable={dragAndDropActive}
          setIsDraggable={setDragAndDropActive}
          handleDelete={handleDelete}
        />
      </div>
    </>
  )
}

export default ProductsDashboardPage
