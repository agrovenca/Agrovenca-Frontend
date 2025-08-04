import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useProductFiltersStore } from '@/store/products/useProductFiltersStore'
import { BasePaginatedResponse } from '@/types/shared'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  paginationData: BasePaginatedResponse
  currentItems: number
  setPrevPage: () => void
  setNextPage: () => void
  setPageNumber: (page: number) => void
}

const handleClick = (callback: (page?: number) => void) => {
  window.scrollTo(0, 0)
  callback()
}

function getVisiblePages(current: number, total: number): (number | 'dots')[] {
  const delta = 1 // Vecinos inmediatos
  const range: (number | 'dots')[] = []

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 || // primera
      i === total || // última
      Math.abs(i - current) <= delta // vecinas
    ) {
      range.push(i)
    } else if (
      i === current - delta - 1 || // salto antes de vecinas
      i === current + delta + 1 // salto después de vecinas
    ) {
      range.push('dots')
    }
  }

  return range.filter((v, i, self) => v !== 'dots' || self[i - 1] !== 'dots')
}

function Pagination({
  paginationData,
  currentItems,
  setPrevPage,
  setNextPage,
  setPageNumber,
}: Props) {
  const { limit } = useProductFiltersStore()
  const { hasNextPage, hasPreviousPage, page: currentPage, totalPages } = paginationData
  const visiblePages = getVisiblePages(currentPage, totalPages)

  return (
    <div className="flex flex-col gap-2 items-center mt-4">
      <div className="flex items-center font-serif flex-wrap">
        <span>Mostrando</span>
        <Badge className="mx-1" variant={'outline'}>
          {(currentPage - 1) * limit + 1}{' '}
        </Badge>{' '}
        <span>a</span>
        <Badge className="mx-1" variant={'outline'}>
          {(currentPage - 1) * limit + currentItems}{' '}
        </Badge>
        <span>de</span>{' '}
        <Badge className="mx-1" variant={'outline'}>
          {paginationData.totalItems}
        </Badge>
        <span>resultados en total</span>
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-center mt-4 p-4">
        <Button
          variant={'outline'}
          disabled={!hasPreviousPage}
          onClick={() => handleClick(setPrevPage)}
          className={`flex items-center gap-2 ${
            !hasPreviousPage ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <ChevronLeft />
          <span>Anterior</span>
        </Button>

        <div className="flex gap-2 justify-between items-center">
          {visiblePages.map((page, idx) =>
            page === 'dots' ? (
              <span key={`dots-${idx}`} className="px-2 text-muted-foreground select-none">
                …
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? 'ghost' : 'default'}
                disabled={page === currentPage}
                className={page === currentPage ? 'cursor-not-allowed border' : 'cursor-pointer'}
                onClick={() => handleClick(() => setPageNumber(page))}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant={'outline'}
          disabled={!hasNextPage}
          onClick={() => handleClick(setNextPage)}
          className={`flex items-center gap-2 ${
            !hasNextPage ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <span>Siguiente</span>
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
