import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CSS } from '@dnd-kit/utilities'
import { Product } from '@/types/product'
import Pagination from '@/components/blocks/pagination'
import { formatDecimal } from '@/lib/utils'
import UpdateProduct from './Update'
import DeleteDialog from '@/components/blocks/DeleteDialog'
import { ExternalLinkIcon } from 'lucide-react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { destroy, updateProductOrder } from '@/actions/settings/products'

import { KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { useProductsStore } from '@/store/dashboard/useProductsStore'
import { usePaginationStore } from '@/store/shared/usePaginationStore'
import { toast } from 'sonner'

const GetTableHeaders = () => {
  return (
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
  )
}

const GetTableRow = ({
  product,
  isDraggable,
  handleDelete,
}: {
  product: Product
  isDraggable: boolean
  handleDelete: (productId: string) => Promise<void>
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: product.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const sortableProps = isDraggable ? { ref: setNodeRef, style, ...attributes, ...listeners } : {}

  return (
    <TableRow key={product.id} {...sortableProps}>
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
        {!isDraggable && (
          <div className="flex items-center gap-2">
            <Button
              variant={'ghost'}
              size={'icon'}
              className="text-yellow-500"
              title="Ver producto"
            >
              <ExternalLinkIcon />
            </Button>
            <UpdateProduct object={product} />
            <DeleteDialog
              action={() => destroy(product.id)}
              callback={() => handleDelete(product.id)}
            />
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}

type Props = {
  isDraggable: boolean
  setPage: React.Dispatch<React.SetStateAction<number>>
  setIsDraggable: React.Dispatch<React.SetStateAction<boolean>>
  handleDelete: (productId: string) => Promise<void>
}

function ProductsTable({ isDraggable, setPage, setIsDraggable, handleDelete }: Props) {
  const products = useProductsStore((state) => state.products)
  const setProducts = useProductsStore((state) => state.setProducts)

  const paginationData = usePaginationStore((state) => state.paginationData)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleReorder = async (reorderedItems: { id: string; displayOrder: number }[]) => {
    setIsDraggable(false)
    try {
      const res = await updateProductOrder(reorderedItems)
      if (res.error) {
        throw new Error(res.error)
      }

      if (res.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            const updatedItem = reorderedItems.find((item) => item.id === product.id)
            return updatedItem ? { ...product, displayOrder: updatedItem.displayOrder } : product
          })
        )
      }
    } catch (_error) {
      throw new Error('Error al actualizar el orden de los productos')
    } finally {
      setIsDraggable(true)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active.id !== over?.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)
        const newItems = arrayMove(items, oldIndex, newIndex)

        const reordered = newItems.map((item, index) => ({
          ...item,
          displayOrder: index + 1,
        }))

        try {
          handleReorder(reordered.map((p) => ({ id: p.id, displayOrder: p.displayOrder })))

          toast.success('Orden actualizado correctamente')
        } catch (error) {
          console.error('Error actualizando el orden:', error)
        }

        return reordered
      })
    }
  }

  return (
    <>
      {isDraggable ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <Table className="my-4">
            <GetTableHeaders />
            <TableBody>
              {products.length > 0 ? (
                <SortableContext
                  items={products.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {products.map((product) => (
                    <GetTableRow
                      product={product}
                      key={product.id}
                      isDraggable={isDraggable}
                      handleDelete={handleDelete}
                    />
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
        </DndContext>
      ) : (
        <Table className="my-4">
          <GetTableHeaders />
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <GetTableRow
                  product={product}
                  key={product.id}
                  isDraggable={isDraggable}
                  handleDelete={handleDelete}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No existen productos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {paginationData && (
        <Pagination paginationData={paginationData} onPageChange={(newPage) => setPage(newPage)} />
      )}
    </>
  )
}

export default ProductsTable
