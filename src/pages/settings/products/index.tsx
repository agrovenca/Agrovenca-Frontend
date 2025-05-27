import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCwIcon } from 'lucide-react'
import { Loader } from '@/components/ui/loader'
import { useDebouncedCallback } from 'use-debounce'
import CreateProduct from './Create'
import { getAll as getCategories } from '@/actions/settings/categories'
import { getAll as getUnities } from '@/actions/settings/unities'
import { getProducts } from '@/actions/settings/products'
import SearchBar from '@/components/blocks/SearchBar'
import { usePaginationStore } from '@/store/shared/usePaginationStore'
import { useProductsStore } from '@/store/dashboard/useProductsStore'
import { useUnitiesStore } from '@/store/dashboard/useUnitiesStore'
import { useCategoriesStore } from '@/store/dashboard/useCategoriesStore'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import ExtendedTooltip from '@/components/blocks/ExtendedTooltip'
import ProductsTable from './ProductsTable'

function ProductsSettingsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [dragAndDropActive, setDragAndDropActive] = useState(false)

  const setProducts = useProductsStore((state) => state.setProducts)
  const setUnities = useUnitiesStore((state) => state.setUnities)
  const setCategories = useCategoriesStore((state) => state.setCategories)
  const setPaginationData = usePaginationStore((state) => state.setPaginationData)

  const fetchData = useCallback(
    async (currentPage: number, search: string) => {
      setIsLoading(true)
      try {
        const { data } = await getProducts({ page: currentPage, search })
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
    fetchData(page, debouncedSearch)
  }, [fetchData, page, debouncedSearch])

  useEffect(() => {
    getAssociatedData()
  }, [getAssociatedData])

  const debounced = useDebouncedCallback((value) => {
    setPage(1)
    setDebouncedSearch(value)
  }, 500)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    debounced(value)
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
          <SearchBar value={search} onChange={handleSearchChange} />
        </div>
        <div className="flex items-center gap-2">
          <CreateProduct />
          <Button
            variant={'outline'}
            onClick={() => fetchData(page, search)}
            className="flex items-center gap-2"
          >
            <RefreshCwIcon />
            <span>Recargar</span>
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
              <span>Modo Editable: {dragAndDropActive ? 'Activado' : 'Desactivado'}</span>
            </Label>
          </ExtendedTooltip>
        </div>
      </div>
      <ProductsTable
        page={page}
        search={search}
        setPage={setPage}
        fetchData={fetchData}
        isDraggable={dragAndDropActive}
      />
    </>
  )
}

export default ProductsSettingsPage
