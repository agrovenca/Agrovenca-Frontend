import { useProductFiltersStore } from '@/store/products/useProductFiltersStore'
import { useDebounce } from 'use-debounce'
import { limitOptions } from '@/lib/productLimitOptions'
import useProducts from '@/hooks/products/useProducts'
import useCategories from '@/hooks/categories/useCategories'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FilterIcon, FilterXIcon, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import useUnities from '@/hooks/unities/useUnities'
import { Unity } from '@/types/unity'
import { Category } from '@/types/category'
import { Slider } from '@/components/ui/slider'

function RenderMultiSelect({
  label,
  localData,
  setLocalData,
  queryData,
}: {
  label: string
  localData: string[]
  setLocalData: (idCollection: string[]) => void
  queryData: Unity[] | Category[] | undefined
}) {
  if (!queryData) return
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {localData.length > 0
            ? localData
                .map((id) => {
                  const item = queryData.find((i) => i.id === id)
                  return item ? item.name : ''
                })
                .join(', ')
            : `Selecciona ${label}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px]">
        <div className="flex flex-col gap-2">
          {queryData.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Checkbox
                id={item.id}
                checked={localData.includes(item.id)}
                onCheckedChange={(checked) => {
                  const newValue = checked
                    ? [...(localData || []), item.id]
                    : (localData || []).filter((val) => val !== item.id)
                  setLocalData(newValue)
                }}
              />
              <label htmlFor={item.id} className="text-sm capitalize">
                {item.name} ({item._count.products})
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function FiltersDialog() {
  const limit = useProductFiltersStore((state) => state.limit)
  const setLimit = useProductFiltersStore((state) => state.setLimit)
  const categoriesId = useProductFiltersStore((state) => state.categoriesId)
  const setCategoriesId = useProductFiltersStore((state) => state.setCategoriesId)
  const unitiesId = useProductFiltersStore((state) => state.unitiesId)
  const setUnitiesId = useProductFiltersStore((state) => state.setUnitiesId)
  const priceRange = useProductFiltersStore((state) => state.priceRange)
  const setPriceRange = useProductFiltersStore((state) => state.setPriceRange)
  const [tempRange, setTempRange] = useState(priceRange)
  const resetFilters = useProductFiltersStore((state) => state.resetFilters)

  const { categoriesQuery } = useCategories()
  const { unitiesQuery } = useUnities()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'}>
          <FilterIcon />
          <span>Filtros</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
          <DialogDescription>
            Filtra los productos por categoría y por cantidad de productos por página.
          </DialogDescription>
        </DialogHeader>

        <section className="flex flex-col gap-2">
          <div>
            <Select
              value={limit.toString()}
              defaultValue={limit.toString()}
              onValueChange={(value) => setLimit(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Mostrar" />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    Mostrar {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <RenderMultiSelect
              label="Categorías"
              localData={categoriesId}
              setLocalData={setCategoriesId}
              queryData={categoriesQuery.data}
            />
          </div>
          <div>
            <RenderMultiSelect
              label="Unidades"
              localData={unitiesId}
              setLocalData={setUnitiesId}
              queryData={unitiesQuery.data}
            />
          </div>
          <div>
            <h3 className="font-semibold mb-3">Rango de precio</h3>
            <div className="ps-4">
              <Slider
                value={tempRange}
                onValueChange={setTempRange}
                onValueCommit={(value) => setPriceRange(value)}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2 font-serif">
                <span>${tempRange[0]}</span>
                <span>${tempRange[1]}</span>
              </div>
            </div>
          </div>
          <Button variant={'secondary'} className="mt-6" onClick={resetFilters}>
            <FilterXIcon />
            <span>Limpiar filtros</span>
          </Button>
        </section>
      </DialogContent>
    </Dialog>
  )
}

function Filters() {
  const [localSearch, setLocalSearch] = useState('')
  const setSearch = useProductFiltersStore((state) => state.setSearch)

  const [debouncedSearch] = useDebounce(localSearch, 500)

  useProducts({})

  useEffect(() => {
    setSearch(debouncedSearch)
  }, [debouncedSearch, setSearch])

  return (
    <div className="flex-1 flex gap-2">
      <div className="relative w-full max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Filtrar por nombre..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      <FiltersDialog />
    </div>
  )
}

export default Filters
