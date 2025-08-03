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
import { DndContext, closestCenter } from '@dnd-kit/core'

import { KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { toast } from 'sonner'
import ProductImagesPage from './images'
import ProductImagePlaceholder from '@/assets/images/productImagePlaceholder.png'
import useProducts from '@/hooks/products/useProducts'
import { Loader } from '@/components/ui/loader'
import DeleteProduct from './Delete'
import { useProductFiltersStore } from '@/store/products/useProductFiltersStore'
import UpdateProductOrder from './UpdateOrder'
import { useReorderProducts } from '@/hooks/products/useReorderProducts'
import { useProductActions } from '@/hooks/products/useActions'
import { Badge } from '@/components/ui/badge'

const GetTableHeaders = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">#</TableHead>
        <TableHead className="w-34"></TableHead>
        <TableHead className="w-full">Producto</TableHead>
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
  totalProducts,
  isDraggable,
}: {
  product: Product
  totalProducts: number
  isDraggable: boolean
}) => {
  const { getFirstProductImage } = useProductActions(product)
  const firstProductImage = getFirstProductImage(product.images)

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
            src={firstProductImage?.s3Key}
            alt={`Imagen del producto ${product.name}`}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = ProductImagePlaceholder
            }}
          />
          <Badge className="absolute bg-primary top-0 right-0 text-primary-foreground h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
            {product.images.length}
          </Badge>
        </figure>
      </TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>
        <Badge className="py-1 px-3 w-full max-w-20">{product.stock}</Badge>
      </TableCell>
      <TableCell>
        <Badge className="py-1 px-3 w-full max-w-24">$ {formatDecimal(product.price)}</Badge>
      </TableCell>
      <TableCell>
        <Badge className="py-1 px-3 w-full max-w-24" variant={'secondary'}>
          $ {formatDecimal(product.secondPrice)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        {!isDraggable && (
          <div className="flex items-center gap-2">
            <ProductImagesPage product={product} />
            <UpdateProductOrder product={product} maxOrder={totalProducts} />
            <UpdateProduct product={product} />
            <DeleteProduct product={product} />
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}

type Props = {
  isDraggable: boolean
  setIsDraggable: React.Dispatch<React.SetStateAction<boolean>>
}

function ProductsTable({ isDraggable, setIsDraggable }: Props) {
  const { page, limit } = useProductFiltersStore()
  const { productsQuery, setNextPage, setPrevPage, setPageNumber } = useProducts({})
  const { reorderMutation } = useReorderProducts()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  async function handleDragEnd(event: DragEndEvent, products: Product[]) {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = products.findIndex((item) => item.id === active.id)
      const newIndex = products.findIndex((item) => item.id === over?.id)
      const newItems = arrayMove(products, oldIndex, newIndex)

      const offset = limit === 0 || limit === Infinity ? 0 : (page - 1) * limit

      const reordered = newItems.map((item, index) => ({
        ...item,
        displayOrder: offset + index + 1,
      }))

      setIsDraggable(false)
      reorderMutation.mutate(
        reordered.map((p) => ({ id: p.id, displayOrder: p.displayOrder })),
        {
          onSuccess: ({ message }) => {
            toast.success(message)
          },
          onError: () => {
            toast.error('Error al actualizar el orden de los productos')
          },
          onSettled: () => {
            setIsDraggable(true)
          },
        }
      )
    }
  }

  return (
    <div className="flex-1">
      {isDraggable ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => handleDragEnd(event, productsQuery.data?.objects as Product[])}
        >
          <Table className="my-4">
            <GetTableHeaders />
            <TableBody>
              {productsQuery.isPending && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <div className="flex items-center justify-center h-full w-full gap-2">
                      <Loader size="md" />
                      <span>Cargando...</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {productsQuery.isSuccess && productsQuery.data.objects.length ? (
                <SortableContext
                  items={productsQuery.data.objects.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {productsQuery.data.objects.map((product) => (
                    <GetTableRow
                      key={product.id}
                      product={product}
                      isDraggable={isDraggable}
                      totalProducts={productsQuery.data.pagination.totalItems}
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
            {productsQuery.isSuccess && productsQuery.data.objects.length ? (
              productsQuery.data.objects.map((product) => (
                <GetTableRow
                  key={product.id}
                  product={product}
                  isDraggable={isDraggable}
                  totalProducts={productsQuery.data.pagination.totalItems}
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

      {productsQuery.data && (
        <Pagination
          paginationData={productsQuery.data.pagination}
          currentItems={productsQuery.data.objects.length}
          setNextPage={setNextPage}
          setPrevPage={setPrevPage}
          setPageNumber={setPageNumber}
        />
      )}
    </div>
  )
}

export default ProductsTable
