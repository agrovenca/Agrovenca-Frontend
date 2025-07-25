import { createProductImage } from '@/actions/products/images'
import { Product, ProductsPaginatedResponse } from '@/types/product'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProductsQueryKey } from '../useProductsQueryKey'
import { ProductImage } from '@/types/product/images'
import { emptyPagination } from '@/lib/productEmptyPagination'

interface Props {
  product: Product
}

function useCreateProductImage({ product }: Props) {
  const queryClient = useQueryClient()
  const filters = useProductsQueryKey()

  const createProductImageMutation = useMutation({
    mutationFn: createProductImage,
    onMutate: ({ newImages }) => {
      const optimisticImages: ProductImage[] = newImages.files.map((newFile, idx) => {
        return {
          id: `temp-${crypto.randomUUID()}`,
          s3Key: URL.createObjectURL(newFile),
          createdAt: new Date().toISOString(),
          displayOrder: product.images.length + idx + 1,
          productId: product.id,
        }
      })

      const optimisticProduct: Product = {
        ...product,
        images: [...product.images, ...optimisticImages],
      }

      queryClient.setQueryData<ProductsPaginatedResponse>(['products', filters], (oldProducts) => {
        if (!oldProducts || !oldProducts.objects)
          return { objects: [optimisticProduct], pagination: emptyPagination }
        return {
          ...oldProducts,
          objects: oldProducts.objects.map((p) => (p.id === product.id ? optimisticProduct : p)),
        }
      })
      return { optimisticProduct, optimisticImages }
    },
    onSuccess: ({ images: newImages }, _variables, context) => {
      queryClient.setQueryData<ProductsPaginatedResponse>(['products', filters], (oldProducts) => {
        if (!oldProducts || !oldProducts.objects)
          return { pagination: emptyPagination, objects: [context.optimisticProduct] }

        return {
          ...oldProducts,
          objects: oldProducts.objects.map((product) =>
            product.id === context.optimisticProduct.id
              ? { ...context.optimisticProduct, images: newImages }
              : product
          ),
        }
      })
      // Actualizar en producto individual
      queryClient.setQueryData<Product>(['products', { slug: product.slug }], (oldProduct) =>
        oldProduct ? { ...oldProduct, images: newImages } : oldProduct
      )
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData<ProductsPaginatedResponse>(['products', filters], (oldProducts) => {
        if (!oldProducts || !oldProducts.objects)
          return { pagination: emptyPagination, objects: [] }

        return {
          ...oldProducts,
          objects: oldProducts.objects.map((product) => {
            // Revertir solo las imágenes agregadas optimistamente
            const optimisticImageIds = context?.optimisticImages?.map((img) => img.id) ?? []
            return {
              ...product,
              images: product.images.filter((image) => !optimisticImageIds.includes(image.id)),
            }
          }),
        }
      })
    },
  })

  return { createProductImageMutation }
}

export default useCreateProductImage
