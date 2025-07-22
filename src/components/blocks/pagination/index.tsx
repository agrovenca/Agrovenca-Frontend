import { Button } from '@/components/ui/button'
import { BasePaginatedResponse } from '@/types/shared'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  paginationData: BasePaginatedResponse
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

function Pagination({ paginationData, setPrevPage, setNextPage, setPageNumber }: Props) {
  const { hasNextPage, hasPreviousPage, page: currentPage, totalPages } = paginationData
  const visiblePages = getVisiblePages(currentPage, totalPages)

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center mt-4 p-4">
      <Button
        variant={'outline'}
        disabled={!hasPreviousPage}
        onClick={() => handleClick(setPrevPage)}
        className="flex items-center gap-2"
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
        className="flex items-center gap-2"
      >
        <span>Siguiente</span>
        <ChevronRight />
      </Button>
    </div>
  )
}

export default Pagination
