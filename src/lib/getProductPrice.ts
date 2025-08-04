import { Product } from '@/types/product'

export const getProductPrice = (product: Product) =>
  product.secondPrice && product.secondPrice != 0 ? product.secondPrice : product.price
