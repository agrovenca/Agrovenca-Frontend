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
import { GhostIcon, RefreshCwIcon } from 'lucide-react'
import { Loader } from '@/components/ui/loader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

function ProductsSettingsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [unities, setUnities] = useState<Unity[]>([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async (page: number, search: string) => {
    setIsLoading(true)
    try {
      const response = await getProducts({ page, search })
      setProducts(response.data.objects)
    } catch (error) {
      console.error('Error al obtener productos', error)
    } finally {
      setIsLoading(false)
    }
  }

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
    fetchData(page, search)
  }, [page, search])

  useEffect(() => {
    getAssociatedData()
  }, [])

  const debounced = useDebouncedCallback((value) => {
    fetchData(1, value)
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

  if (products.length <= 0) {
    return (
      <div className="p-4 w-full flex justify-center items-center flex-col">
        <GhostIcon className="w-16 h-16 animate-bounce" />
        <span>No existen productos</span>
      </div>
    )
  }

  return (
    <>
      <div className="w-full flex justify-between gap-4 mb-4">
        <div className="pt-4 flex-1">
          <form>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="search" className="sr-only">
                Buscar
              </Label>
              <Input
                type="search"
                id="search"
                placeholder="Buscar usuarios"
                value={search}
                autoFocus
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </form>
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
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext
              items={products.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {products.map((product) => (
                <SortableItem product={product} key={product.id} />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
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
      <TableCell>{product.id}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center gap-2">{/* acciones */}</div>
      </TableCell>
    </TableRow>
  )
}

export default ProductsSettingsPage
