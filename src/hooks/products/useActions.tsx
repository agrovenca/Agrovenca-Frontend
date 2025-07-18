import { toast } from 'sonner'
import { useState } from 'react'
import { useCartStore } from '@/store/cart/useCartStore'
import { useSavedStore } from '@/store/products/useSavedStore'
import { Product } from '@/types/product'
import { ProductImage } from '@/types/product/images'

import ProductImagePlaceholder from '@/assets/images/productImagePlaceholder.png'

const spaceBaseUrl = import.meta.env.VITE_AWS_SPACE_BASE_URL + '/'

export function useProductActions(product?: Product) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)
  const deleteItem = useCartStore((state) => state.deleteItem)
  const savedProducts = useSavedStore((state) => state.products)
  const saveProduct = useSavedStore((state) => state.addProduct)
  const removeSaved = useSavedStore((state) => state.removeProduct)

  const productStock = product?.stock ?? 1

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, Math.min(productStock, quantity + change)))
  }

  const handleAddCartItem = async ({
    product,
    quantity,
  }: {
    product: Product
    quantity: number
  }) => {
    addItem({ product, productId: product.id, quantity })
    toast.success('Producto añadido al carrito correctamente')
  }

  const handleRemoveCartItem = async ({ productId }: { productId: string }) => {
    deleteItem(productId)
    toast.success('Producto eliminado del carrito correctamente')
  }

  const handleSaveItem = async ({ product }: { product: Product }) => {
    saveProduct(product)
    toast.success('Producto guardado en favoritos correctamente')
  }

  const handleUnSaveItem = async ({ productId }: { productId: string }) => {
    removeSaved(productId)
    toast.success('Producto eliminado de favoritos correctamente')
  }

  const isProductSaved = savedProducts.some(
    (savedProduct) => savedProduct.id === (product?.id ?? '')
  )

  const getFirstProductImage = (images: ProductImage[]) => {
    if (images.length === 0) {
      return { id: 0, s3Key: ProductImagePlaceholder }
    }
    const image = images.find((image) => image.displayOrder === 1)

    if (image) {
      return { ...image, s3Key: spaceBaseUrl + image.s3Key }
    }
  }

  return {
    quantity,
    setQuantity,
    handleQuantityChange,
    handleAddCartItem,
    handleRemoveCartItem,
    handleSaveItem,
    handleUnSaveItem,
    isProductSaved,
    getFirstProductImage,
  }
}
