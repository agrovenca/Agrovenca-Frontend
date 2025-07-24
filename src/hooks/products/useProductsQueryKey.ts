import { useProductFiltersStore } from '@/store/products/useProductFiltersStore'

export function useProductsQueryKey() {
  const page = useProductFiltersStore((state) => state.page)
  const limit = useProductFiltersStore((state) => state.limit)
  const search = useProductFiltersStore((state) => state.search)
  const categoriesId = useProductFiltersStore((state) => state.categoriesId)
  const unitiesId = useProductFiltersStore((state) => state.unitiesId)
  const priceRange = useProductFiltersStore((state) => state.priceRange)
  return { page, limit, search, categoriesId, unitiesId, priceRange }
}

export function useProductsFilterSetters() {
  const setPage = useProductFiltersStore((state) => state.setPage)
  const setLimit = useProductFiltersStore((state) => state.setLimit)
  const setSearch = useProductFiltersStore((state) => state.setSearch)
  const setCategoriesId = useProductFiltersStore((state) => state.setCategoriesId)
  const setUnitiesId = useProductFiltersStore((state) => state.setUnitiesId)
  const setPriceRange = useProductFiltersStore((state) => state.setPriceRange)
  return { setPage, setLimit, setSearch, setCategoriesId, setUnitiesId, setPriceRange }
}
