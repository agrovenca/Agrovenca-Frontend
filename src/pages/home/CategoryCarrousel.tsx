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
    <CarouselItem className="basis-4/4 md:basis-1/4">
      <button
        type="button"
        onClick={() => handleClick(category.id)}
        className="p-4 w-full text-sm md:text-lg cursor-pointer rounded-md font-semibold text-white bg-primary dark:bg-muted/70 dark:hover:bg-muted/40 transition text-center uppercase font-serif tracking-wider shadow-[0_0_4px_rgba(189,11,11,0.4)] hover:shadow-[0_0_8px_rgba(189,11,11,0.6)] border-none outline-none dark:shadow-white/70 dark:shadow-md dark:hover:shadow-none dark:hover:scale-[98%] dark:hover:shadow-white duration-300"
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
      <Carousel
        plugins={[Autoplay({ delay: 2000, stopOnMouseEnter: true })]}
        opts={{ loop: true, align: 'center' }}
      >
        <CarouselContent className="px-4 md:p-0 my-4">
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
        <div className="flex gap-2 justify-center items-baseline mt-6 md:hidden">
          <CarouselPrevious className="relative md:hidden" />
          <CarouselNext className="relative md:hidden" />
        </div>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  )
}

export default CategoryCarrousel
