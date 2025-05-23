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

const isCurrentPage = (page: number, currentPage: number) => {
  return page === currentPage
}

const handleClick = (page: number, onPageChange: (page: number) => void) => {
  window.scrollTo(0, 0)
  onPageChange(page)
}

function Pagination({ paginationData, onPageChange }: Props) {
  return (
    <div className="flex gap-4 items-center justify-center mt-4 p-4">
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
        {Array.from({ length: paginationData.totalPages || 0 }).map((_, idx) => (
          <Button
            key={idx}
            variant={isCurrentPage(idx + 1, paginationData.page) ? 'ghost' : 'default'}
            disabled={isCurrentPage(idx + 1, paginationData.page)}
            className={
              isCurrentPage(idx + 1, paginationData.page)
                ? 'cursor-not-allowed border'
                : 'cursor-pointer'
            }
            onClick={() => {
              if (!isCurrentPage(idx + 1, paginationData.page)) {
                handleClick(idx + 1, onPageChange)
              }
            }}
          >
            {idx + 1}
          </Button>
        ))}
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
