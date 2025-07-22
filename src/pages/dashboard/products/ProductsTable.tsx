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
import { destroy } from '@/actions/products'

import { KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import ProductImagesPage from './images'
import ProductImagePlaceholder from '@/assets/images/productImagePlaceholder.png'
import useProducts from '@/hooks/products/useProducts'
import { Loader } from '@/components/ui/loader'
import useReorderProducts from '@/hooks/products/useReorderProducts'

const spaceBaseUrl = import.meta.env.VITE_AWS_SPACE_BASE_URL + '/'

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
  page,
  limit,
  search,
  product,
  isDraggable,
  handleDelete,
}: {
  page: number
  limit: number
  search: string
  product: Product
  isDraggable: boolean
  handleDelete: (productId: string) => Promise<void>
}) => {
  const firstProductImage = product.images.find((image) => image.displayOrder === 1)?.s3Key

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
            src={
              product.images.length > 0 ? spaceBaseUrl + firstProductImage : ProductImagePlaceholder
            }
            alt={`Imagen del producto ${product.name}`}
          />
          <span className="absolute top-0 right-0 bg-blue-500 text-white py-0.5 px-2 rounded-full">
            {product.images.length}
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
            <ProductImagesPage product={product} />
            <Button
              variant={'ghost'}
              size={'icon'}
              className="text-yellow-500"
              title="Ver producto"
            >
              <ExternalLinkIcon />
            </Button>
            <UpdateProduct product={product} page={page} limit={limit} search={search} />
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
  limit: number
  search: string
  isDraggable: boolean
  setIsDraggable: React.Dispatch<React.SetStateAction<boolean>>
}

function ProductsTable({ limit, search, isDraggable, setIsDraggable }: Props) {
  const { productsQuery, page, setNextPage, setPrevPage, setPageNumber } = useProducts({
    search: search,
    limit,
  })
  const { reorderMutation } = useReorderProducts({ page })

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

      const reordered = newItems.map((item, index) => ({
        ...item,
        displayOrder: index + 1,
      }))

      try {
        setIsDraggable(false)
        reorderMutation.mutate(reordered.map((p) => ({ id: p.id, displayOrder: p.displayOrder })))
      } catch (_error) {
        toast.error('Error al actualizar el orden de los productos')
      } finally {
        setIsDraggable(true)
      }
    }
  }

  const handleDelete = async (_productId: string) => {
    //  try {
    //    deleteProduct(productId)
    //    await fetchData({ page, search, limit })
    //  } catch (error) {
    //    console.error('Error al eliminar el producto:', error)
    //  }
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
                      page={page}
                      limit={limit}
                      search={search}
                      key={product.id}
                      product={product}
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
            {productsQuery.isSuccess && productsQuery.data.objects.length ? (
              productsQuery.data.objects.map((product) => (
                <GetTableRow
                  page={page}
                  limit={limit}
                  search={search}
                  key={product.id}
                  product={product}
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

      {productsQuery.data && (
        <Pagination
          paginationData={productsQuery.data.pagination}
          setNextPage={setNextPage}
          setPrevPage={setPrevPage}
          setPageNumber={setPageNumber}
        />
      )}
    </div>
  )
}

export default ProductsTable
