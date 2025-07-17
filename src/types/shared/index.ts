export interface BaseFilterParams {
  page?: number
  search?: string
  limit?: number
}

export interface BasePaginatedResponse {
  page: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextPage: number | null
  previousPage: number | null
}
