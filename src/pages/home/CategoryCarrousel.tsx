import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Loader } from '@/components/ui/loader'
import useCategories from '@/hooks/categories/useCategories'
import { useProductFiltersStore } from '@/store/products/useProductFiltersStore'
import { Category } from '@/types/category'
import { useNavigate } from 'react-router'
import Autoplay from 'embla-carousel-autoplay'

function CategoryItem({ category }: { category: Category }) {
  const navigate = useNavigate()
  const setCategoriesId = useProductFiltersStore((state) => state.setCategoriesId)

  const handleClick = (categoryId: string) => {
    setCategoriesId([categoryId])
    navigate('/products')
  }

  return (
    <CarouselItem className="basis-1/4">
      <button
        type="button"
        onClick={() => handleClick(category.id)}
        className="p-4 w-full cursor-pointer rounded-md font-semibold text-white bg-primary dark:bg-slate-700 dark:hover:bg-slate-600 transition text-center uppercase font-serif tracking-wider"
      >
        {category.name}
      </button>
    </CarouselItem>
  )
}

function CategoryCarrousel() {
  const { categoriesQuery } = useCategories()

  return (
    <div className="container mx-auto my-8">
      <h3 className="text-lg text-center mb-4">¿Buscas alguna categoría en específico?</h3>
      <Carousel plugins={[Autoplay({ delay: 2000, stopOnMouseEnter: true })]} opts={{ loop: true }}>
        <CarouselContent>
          {categoriesQuery.isFetching ? (
            <div className="flex gap-2 items-center">
              <Loader size="sm" /> <span>Cargando...</span>
            </div>
          ) : (
            categoriesQuery.data?.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default CategoryCarrousel
