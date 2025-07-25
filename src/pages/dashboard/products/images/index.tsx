import { CSS } from '@dnd-kit/utilities'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { ImagesIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import RegisterProductImage from './Create'
import { ProductImage } from '@/types/product/images'
import { toast } from 'sonner'
import { destroy, updateProductImagesOrder } from '@/actions/products/images'
import { useProductsStore } from '@/store/products/useProductsStore'
import ExtendedTooltip from '@/components/blocks/ExtendedTooltip'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const spaceBaseUrl = import.meta.env.VITE_AWS_SPACE_BASE_URL + '/'

type SortableImageProps = {
  image: ProductImage
  product: Product
  imagesDraggable: boolean
  handleDelete({ id, product }: { id: string; product: Product }): Promise<void>
}

export function SortableImage({
  image,
  product,
  imagesDraggable,
  handleDelete,
}: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const sortableProps = imagesDraggable
    ? { ref: setNodeRef, style, ...attributes, ...listeners }
    : {}

  return (
    <figure
      {...sortableProps}
      className="max-w-50 w-full overflow-hidden h-auto border rounded-md relative"
    >
      <img
        className="object-cover"
        loading="lazy"
        src={spaceBaseUrl + image.s3Key}
        alt={`Imagen número ${image.displayOrder} del producto ${product.name}`}
      />
      {!imagesDraggable && (
        <button
          type="button"
          onClick={() => handleDelete({ id: image.id, product })}
          className="absolute bottom-1 right-1 bg-black/50 hover:bg-black text-white rounded-full p-1 transition cursor-pointer"
          title="Eliminar imagen"
        >
          <TrashIcon size={16} />
        </button>
      )}
      <span className="absolute top-0 right-0 bg-blue-500 text-white py-0.5 px-2 rounded-full">
        {image.displayOrder}
      </span>
    </figure>
  )
}

type Props = {
  product: Product
}

function ProductImagesPage({ product }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [images, setImages] = useState<ProductImage[]>(product.images)
  const [isLoading, setIsLoading] = useState(false)
  const [imagesDraggable, setImagesDraggable] = useState(false)

  const updateProduct = useProductsStore((state) => state.updateProduct)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleReorder = async (
    reorderedItems: { id: string; productId: string; displayOrder: number }[]
  ) => {
    setIsLoading(true)
    try {
      const res = await updateProductImagesOrder(reorderedItems)
      if (res.error) {
        throw new Error(res.error)
      }
    } catch (_error) {
      throw new Error('Error al actualizar el orden de las imágenes')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const previousImages = [...images]
    const oldIndex = images.findIndex((img) => img.id === active.id)
    const newIndex = images.findIndex((img) => img.id === over.id)
    const reordered = arrayMove(images, oldIndex, newIndex).map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }))

    setImages(reordered)

    try {
      await handleReorder(
        reordered.map((img) => ({
          id: img.id,
          productId: img.productId,
          displayOrder: img.displayOrder,
        }))
      )
      updateProduct({ ...product, images: reordered })
      toast.success('Orden actualizado correctamente')
    } catch (error) {
      console.error('Error actualizando el orden:', error)
      toast.error('Error al actualizar el orden de las imágenes')
      setImages(previousImages)
    }
  }

  async function handleDelete({ id, product }: { id: string; product: Product }) {
    try {
      const res = await destroy(id, product.id)

      if (res.error) {
        throw new Error(res.error)
      }

      if (res.status === 200) {
        const { message, images: reorderedImages } = res.data
        toast.success(message)

        updateProduct({ ...product, images: reorderedImages })
        setImages(reorderedImages)
      }
    } catch (error) {
      console.error('Error eliminando la imagen:', error)
      toast.error('Error al eliminar la imagen')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'ghost'} size={'icon'} title="Imágenes del producto">
          <ImagesIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between flex-wrap gap-2 items-center pt-4">
            <span>Listado de imágenes para este producto</span>
            <RegisterProductImage
              product={product}
              setNewImages={(updatedImages) => {
                setImages(updatedImages)
              }}
            />
          </DialogTitle>
          <DialogDescription>
            {images.length > 0 && (
              <ExtendedTooltip content={<p>Arrastra las imágenes y cambia su orden.</p>}>
                <Label
                  htmlFor="imagesEditableMode"
                  className={`flex items-center space-x-2 text-sm px-4 py-2 h-9 rounded-md bg-gray-100 border dark:bg-gray-700 ${
                    imagesDraggable && 'bg-blue-500 text-white hover:bg-blue-600 animate-pulse'
                  }`}
                >
                  <Switch
                    id="imagesEditableMode"
                    checked={imagesDraggable}
                    onClick={() => setImagesDraggable((prev) => !prev)}
                  />
                  <span>Ordenamiento {imagesDraggable ? 'activado' : 'desactivado'}</span>
                </Label>
              </ExtendedTooltip>
            )}
          </DialogDescription>
        </DialogHeader>
        {imagesDraggable ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={images} strategy={rectSortingStrategy} disabled={isLoading}>
              <section className="flex flex-wrap justify-evenly gap-4">
                {images.length > 0 ? (
                  images.map((image) => (
                    <SortableImage
                      key={image.id}
                      image={image}
                      product={product}
                      imagesDraggable={imagesDraggable}
                      handleDelete={handleDelete}
                    />
                  ))
                ) : (
                  <p>No hay imágenes para este producto</p>
                )}
              </section>
            </SortableContext>
          </DndContext>
        ) : (
          <section className="flex flex-wrap justify-evenly gap-4">
            {images.length > 0 ? (
              images.map((image) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  product={product}
                  imagesDraggable={imagesDraggable}
                  handleDelete={handleDelete}
                />
              ))
            ) : (
              <p>No hay imágenes para este producto</p>
            )}
          </section>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ProductImagesPage
