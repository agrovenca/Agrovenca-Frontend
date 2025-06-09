import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  paginationData: {
    page: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: number | null
    previousPage: number | null
  }
  onPageChange: (page: number) => void
}

const handleClick = (page: number, onPageChange: (page: number) => void) => {
  window.scrollTo(0, 0)
  onPageChange(page)
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

function Pagination({ paginationData, onPageChange }: Props) {
  const visiblePages = getVisiblePages(paginationData.page, paginationData.totalPages)

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center mt-4 p-4">
      <Button
        variant={'outline'}
        disabled={!paginationData.hasPreviousPage}
        onClick={() => {
          if (paginationData.previousPage) handleClick(paginationData.previousPage, onPageChange)
        }}
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
              variant={page === paginationData.page ? 'ghost' : 'default'}
              disabled={page === paginationData.page}
              className={
                page === paginationData.page ? 'cursor-not-allowed border' : 'cursor-pointer'
              }
              onClick={() => handleClick(page, onPageChange)}
            >
              {page}
            </Button>
          )
        )}
      </div>

      <Button
        variant={'outline'}
        disabled={!paginationData.hasNextPage}
        onClick={() => {
          if (paginationData.nextPage) handleClick(paginationData.nextPage, onPageChange)
        }}
        className="flex items-center gap-2"
      >
        <span>Siguiente</span>
        <ChevronRight />
      </Button>
    </div>
  )
}

export default Pagination
