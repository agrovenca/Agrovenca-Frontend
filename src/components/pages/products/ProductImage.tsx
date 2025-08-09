import { getFirstProductImage, productImagePlaceholder } from '@/lib/utils'
import { Product } from '@/types/order'

interface Props {
  product: Product
  className?: string
}

function ProductImage({ product, className }: Props) {
  const firstImage = getFirstProductImage(product.images)

  return (
    <img
      src={firstImage.s3Key}
      loading="lazy"
      alt={product.name}
      className={`object-cover aspect-video ${className}`}
      style={{
        viewTransitionName: `ProductImage-${firstImage.id}`,
      }}
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.src = productImagePlaceholder
      }}
    />
  )
}

export default ProductImage
