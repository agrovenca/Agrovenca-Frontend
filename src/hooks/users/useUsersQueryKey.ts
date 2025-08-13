import { useUserFiltersStore } from '@/store/users/useUserFiltersStore'

export function useUsersQueryKey() {
  const page = useUserFiltersStore((state) => state.page)
  const limit = useUserFiltersStore((state) => state.limit)
  const search = useUserFiltersStore((state) => state.search)
  const isActive = useUserFiltersStore((state) => state.isActive)
  return { page, limit, search, isActive }
}

export function useUsersFilterSetters() {
  const setPage = useUserFiltersStore((state) => state.setPage)
  const setLimit = useUserFiltersStore((state) => state.setLimit)
  const setSearch = useUserFiltersStore((state) => state.setSearch)
  const setIsActive = useUserFiltersStore((state) => state.setIsActive)
  return { setPage, setLimit, setSearch, setIsActive }
}
