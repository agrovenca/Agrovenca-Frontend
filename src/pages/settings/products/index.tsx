import { useCallback, useEffect, useState } from 'react'
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
import { Loader } from '@/components/ui/loader'
import { useDebouncedCallback } from 'use-debounce'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Product } from '@/types/product'
import { Category } from '@/types/category'
import { Unity } from '@/types/unity'
import CreateProduct from './Create'
import { getAll as getCategories } from '@/actions/settings/categories'
import { getAll as getUnities } from '@/actions/settings/unities'
import { getProducts } from '@/actions/settings/products'
import SearchBar from '@/components/blocks/SearchBar'
import { usePaginationStore } from '@/store/shared/usePaginationStore'
import Pagination from '../users/Pagination'
import { formatDecimal } from '@/lib/utils'

function ProductsSettingsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [unities, setUnities] = useState<Unity[]>([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const paginationData = usePaginationStore((state) => state.paginationData)
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
    [setPaginationData]
  )

  const getAssociatedData = async () => {
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
  }

  useEffect(() => {
    fetchData(page, debouncedSearch)
  }, [fetchData, page, debouncedSearch])

  useEffect(() => {
    getAssociatedData()
  }, [])

  const debounced = useDebouncedCallback((value) => {
    setPage(1)
    setDebouncedSearch(value)
  }, 500)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    debounced(value)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active.id !== over?.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)
        return arrayMove(items, oldIndex, newIndex)
      })
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
          <SearchBar value={search} onChange={handleSearchChange} />
        </div>
        <div className="flex items-center gap-2">
          <CreateProduct
            products={products}
            setProducts={setProducts}
            categories={categories}
            unities={unities}
          />
          <Button
            variant={'outline'}
            onClick={() => fetchData(page, search)}
            className="flex items-center gap-2"
          >
            <RefreshCwIcon />
            <span>Recargar</span>
          </Button>
        </div>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Table className="my-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="w-34"></TableHead>
              <TableHead>Producto</TableHead>
              <TableHead className="w-[100px]">Stock</TableHead>
              <TableHead className="w-[150px]">Precio</TableHead>
              <TableHead className="w-[150px]">Segundo Precio</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              <SortableContext
                items={products.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                {products.map((product) => (
                  <SortableItem product={product} key={product.id} />
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No existen productos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {paginationData && (
          <Pagination
            paginationData={paginationData}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </DndContext>
    </>
  )
}

function SortableItem({ product }: { product: Product }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: product.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TableRow key={product.id} style={style} ref={setNodeRef} {...attributes} {...listeners}>
      <TableCell>{product.displayOrder}</TableCell>
      <TableCell>
        <figure className="w-30 h-30 overflow-hidden rounded-md border relative">
          <img
            className="w-full h-full object-cover"
            src={'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg'}
            alt={`Imagen del producto ${product.name}`}
          />
          <span className="absolute top-0 right-0 bg-blue-500 text-white py-0.5 px-2 rounded-full">
            0
          </span>
        </figure>
      </TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>
        <span className="py-1 px-3 rounded-md bg-gray-200 dark:bg-gray-700">{product.stock}</span>
      </TableCell>
      <TableCell>
        <span className="py-1 px-3 rounded-md bg-gray-200 dark:bg-gray-700">
          $ {formatDecimal(product.price)}
        </span>
      </TableCell>
      <TableCell>
        <span className="py-1 px-3 rounded-md bg-gray-200 dark:bg-gray-700">
          $ {formatDecimal(product.secondPrice)}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center gap-2">{/* acciones */}</div>
      </TableCell>
    </TableRow>
  )
}

export default ProductsSettingsPage
