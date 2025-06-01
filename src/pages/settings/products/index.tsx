import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DownloadIcon, RefreshCwIcon } from 'lucide-react'
import { Loader } from '@/components/ui/loader'
import CreateProduct from './Create'
import { getAll as getCategories } from '@/actions/settings/categories'
import { getAll as getUnities } from '@/actions/settings/unities'
import { exportProducts, getProducts } from '@/actions/settings/products'
import { usePaginationStore } from '@/store/shared/usePaginationStore'
import { useProductsStore } from '@/store/dashboard/useProductsStore'
import { useUnitiesStore } from '@/store/dashboard/useUnitiesStore'
import { useCategoriesStore } from '@/store/dashboard/useCategoriesStore'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import ExtendedTooltip from '@/components/blocks/ExtendedTooltip'
import ProductsTable from './ProductsTable'
import ProductFilters from './ProductFilters'
import { useExcelExport } from '@/hooks/useExcelExport'
import { toast } from 'sonner'

function ProductsSettingsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(10)
  const [categoryId, setCategoryId] = useState('')
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
    async (currentPage: number, search: string, limit: number, categoryId: string) => {
      setIsLoading(true)
      try {
        const { data } = await getProducts({ page: currentPage, search, limit, categoryId })
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
        getCategories(),
        getUnities(),
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
    fetchData(page, search, limit, categoryId)
  }, [fetchData, page, search, limit, categoryId])

  useEffect(() => {
    getAssociatedData()
  }, [getAssociatedData])

  const handleFilterSubmit = ({
    search,
    limit,
    categoryId,
  }: {
    search: string
    limit: number
    categoryId: string
  }) => {
    setPage(1)
    setSearch(search)
    setLimit(limit)
    setCategoryId(categoryId)
  }

  const handleDelete = async (productId: string) => {
    try {
      deleteProduct(productId)
      await fetchData(page, search, limit, categoryId)
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
        <div className="pt-4 flex-1">
          <ProductFilters
            initialSearch={search}
            initialLimit={limit}
            initialCategoryId={categoryId}
            onSubmit={handleFilterSubmit}
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
            onClick={() => fetchData(page, search, limit, categoryId)}
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

      <ProductsTable
        setPage={setPage}
        isDraggable={dragAndDropActive}
        setIsDraggable={setDragAndDropActive}
        handleDelete={handleDelete}
      />
    </>
  )
}

export default ProductsSettingsPage
