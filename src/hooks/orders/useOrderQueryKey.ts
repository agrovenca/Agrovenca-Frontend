import { useOrderFiltersStore } from '@/store/orders/useOrderFiltersStore'

export function useOrdersQueryKey() {
  const page = useOrderFiltersStore((state) => state.page)
  const limit = useOrderFiltersStore((state) => state.limit)
  const search = useOrderFiltersStore((state) => state.search)
  return { page, limit, search }
}

export function useOrdersFilterSetters() {
  const setPage = useOrderFiltersStore((state) => state.setPage)
  const setLimit = useOrderFiltersStore((state) => state.setLimit)
  const setSearch = useOrderFiltersStore((state) => state.setSearch)
  return { setPage, setLimit, setSearch }
}
