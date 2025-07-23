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
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

function Filters() {
  const [localSearch, setLocalSearch] = useState('')
  const setSearch = useProductFiltersStore((state) => state.setSearch)
  const limit = useProductFiltersStore((state) => state.limit)
  const setLimit = useProductFiltersStore((state) => state.setLimit)
  const categoriesId = useProductFiltersStore((state) => state.categoriesId)
  const setCategoriesId = useProductFiltersStore((state) => state.setCategoriesId)
  const [debouncedSearch] = useDebounce(localSearch, 500)

  const { categoriesQuery } = useCategories()
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
      <div>
        <Select defaultValue={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
          <SelectTrigger className="w-[180px]">
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {categoriesId.length > 0
                ? categoriesId
                    .map((id) => {
                      const category = categoriesQuery.data?.find((cat) => cat.id === id)
                      return category ? category.name : ''
                    })
                    .join(', ')
                : 'Selecciona categorías'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px]">
            <div className="flex flex-col gap-2">
              {categoriesQuery.data?.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <Checkbox
                    id={category.id}
                    checked={categoriesId.includes(category.id)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...(categoriesId || []), category.id]
                        : (categoriesId || []).filter((val) => val !== category.id)
                      setCategoriesId(newValue)
                    }}
                  />
                  <label htmlFor={category.id} className="text-sm capitalize">
                    {category.name} ({category._count.products})
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default Filters
