import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useCategoriesStore } from '@/store/categories/useCategoriesStore'
import { useCallback, useEffect, useState } from 'react'

import { getAllCategories } from '@/actions/categories'
import { getAllUnities } from '@/actions/unities'
import { useUnitiesStore } from '@/store/unities/useUnitiesStore'
import { ProductFilterParams } from '@/types/product'
import { Filter } from 'lucide-react'

function CategoryList({
  isLoading,
  categoriesIds,
  setCategoriesIds,
}: {
  isLoading: boolean
  categoriesIds: string[]
  setCategoriesIds: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const categories = useCategoriesStore((state) => state.categories)
  return (
    <div>
      <h3 className="font-semibold mb-3 font-sans">Categorías</h3>
      <div className="flex flex-col justify-start gap-2 ps-4">
        {isLoading ? (
          'Cargando categorías'
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={categoriesIds.some((id) => id === category.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setCategoriesIds((prev) => [...prev, category.id])
                  } else {
                    setCategoriesIds((prev) => prev.filter((id) => id !== category.id))
                  }
                }}
              />
              <Label
                htmlFor={category.id}
                className="text-sm font-serif font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex gap-1 items-center"
              >
                <span className="text-green-600 dark:text-green-400">
                  ({category._count.products})
                </span>{' '}
                <span>{category.name}</span>
              </Label>
            </div>
          ))
        ) : (
          <li>No hay Categorías</li>
        )}
      </div>
    </div>
  )
}

function UnityList({
  isLoading,
  unitiesIds,
  setUnitiesIds,
}: {
  isLoading: boolean
  unitiesIds: string[]
  setUnitiesIds: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const unities = useUnitiesStore((state) => state.unities)
  return (
    <div>
      <h3 className="font-semibold mb-3 font-sans">Unidades</h3>
      <div className="flex flex-col justify-start gap-2 ps-4">
        {isLoading ? (
          'Cargando unidades'
        ) : unities.length > 0 ? (
          unities.map((unity) => (
            <div key={unity.id} className="flex items-center space-x-2">
              <Checkbox
                id={unity.id}
                checked={unitiesIds.some((id) => id === unity.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setUnitiesIds((prev) => [...prev, unity.id])
                  } else {
                    setUnitiesIds((prev) => prev.filter((id) => id !== unity.id))
                  }
                }}
              />
              <Label
                htmlFor={unity.id}
                className="text-sm font-serif font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex gap-1 items-center"
              >
                <span className="text-green-600 dark:text-green-400">
                  ({unity._count.products})
                </span>{' '}
                <span>{unity.name}</span>
              </Label>
            </div>
          ))
        ) : (
          <li>No hay unidades</li>
        )}
      </div>
    </div>
  )
}

type Props = {
  limit: number
  search: string
  recordsPerPage: number[]
  setLimit: (limit: number) => void
  setSearch: (search: string) => void
  fetchProducts: (params?: ProductFilterParams) => Promise<void>
}

function FilterForm({
  limit,
  search,
  setLimit,
  setSearch,
  isLoading,
  setIsLoading,
  recordsPerPage,
  fetchProducts,
}: {
  isLoading: boolean
  setIsLoading: (state: boolean) => void
} & Props) {
  const [priceRange, setPriceRange] = useState([0, 1700])
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [categoriesIds, setCategoriesIds] = useState<string[]>([])
  const [unitiesIds, setUnitiesIds] = useState<string[]>([])

  const handleFilters = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await fetchProducts({
        categoriesIds,
        unitiesIds,
        inStockOnly: showOnlyInStock,
        priceRange,
        search,
      })
    } catch (error) {
      console.error('Error al filtrar los productos', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    setSearch('')
    setUnitiesIds([])
    setCategoriesIds([])
    setPriceRange([0, 1000])
    setShowOnlyInStock(false)
    try {
      await fetchProducts()
    } catch (error) {
      console.error('Error al obtener productos', error)
    } finally {
      setIsLoading(false)
    }
    return
  }
  return (
    <form className="space-y-4" onSubmit={handleFilters}>
      <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Regístros por página" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="font-sans">Regístros por página</SelectLabel>
            {recordsPerPage.map((n) => (
              <SelectItem value={n.toString()} key={n}>
                {n}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <CategoryList
        isLoading={isLoading}
        categoriesIds={categoriesIds}
        setCategoriesIds={setCategoriesIds}
      />
      <UnityList isLoading={isLoading} unitiesIds={unitiesIds} setUnitiesIds={setUnitiesIds} />
      <div>
        <h3 className="font-semibold mb-3">Rango de precio</h3>
        <div className="ps-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2 font-serif">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="in-stock"
          checked={showOnlyInStock}
          onCheckedChange={(e) => setShowOnlyInStock(e as boolean)}
        />
        <label
          htmlFor="in-stock"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Sólo en stock
        </label>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          variant={'outline'}
          className="bg-blue-400 hover:bg-blue-500 text-white dark:bg-green-400 dark:hover:bg-green-500 dark:text-black uppercase"
        >
          Filtrar
        </Button>
        <Button type="button" onClick={handleReset} variant={'outline'} className="uppercase">
          Limpiar
        </Button>
      </div>
    </form>
  )
}

export function FiltersBar({
  limit,
  search,
  setSearch,
  setLimit,
  fetchProducts,
  recordsPerPage,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const props = {
    limit,
    search,
    setLimit,
    setSearch,
    isLoading,
    setIsLoading,
    fetchProducts,
    recordsPerPage,
  }

  const setCategories = useCategoriesStore((state) => state.setCategories)
  const setUnities = useUnitiesStore((state) => state.setUnities)

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getAllCategories()
      setCategories(res.data)
    } catch (error) {
      console.error('Error al obtener las categorías', error)
    } finally {
      setIsLoading(false)
    }
  }, [setCategories])

  const fetchUnities = useCallback(async () => {
    try {
      const res = await getAllUnities()
      setUnities(res.data)
    } catch (error) {
      console.error('Error al obtener las unidades', error)
    } finally {
      setIsLoading(false)
    }
  }, [setUnities])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchUnities()
  }, [fetchUnities])

  return (
    <>
      <aside className="hidden md:block w-75 shrink-0">
        <Card className="p-6 gap-2">
          <CardTitle>
            <h2 className="font-semibold mb-4 font-sans">Filtros</h2>
          </CardTitle>
          <CardContent className="px-2">
            <FilterForm {...props} />
          </CardContent>
        </Card>
      </aside>
      {/* Mobile Filter Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Filter className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Filter products by category, price, and availability
            </SheetDescription>
          </SheetHeader>
          <FilterForm {...props} />
        </SheetContent>
      </Sheet>
    </>
  )
}
