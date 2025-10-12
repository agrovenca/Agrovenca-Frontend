import { limitOptions } from '@/lib/orderLimitOptions'
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
import { Input } from '@/components/ui/input'
import { useOrderFiltersStore } from '@/store/orders/useOrderFiltersStore'
import { FilterIcon, FilterXIcon, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useDebounce } from 'use-debounce'
import { Button } from '@/components/ui/button'
import useOrders from '@/hooks/orders/useOrders'

function OrderFiltersDialog() {
  const limit = useOrderFiltersStore((state) => state.limit)
  const setLimit = useOrderFiltersStore((state) => state.setLimit)
  const resetFilters = useOrderFiltersStore((state) => state.resetFilters)

  const handleReset = () => {
    resetFilters()
    toast.info('Filtros reseteados')
  }

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) toast.success('Filtros aplicados')
      }}
    >
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
          <Button variant={'secondary'} className="mt-6" onClick={handleReset}>
            <FilterXIcon />
            <span>Limpiar filtros</span>
          </Button>
        </section>
      </DialogContent>
    </Dialog>
  )
}

function OrdersFilters() {
  const [localSearch, setLocalSearch] = useState('')
  const setSearch = useOrderFiltersStore((state) => state.setSearch)

  const [debouncedSearch] = useDebounce(localSearch, 500)

  useOrders()

  useEffect(() => {
    setSearch(debouncedSearch)
  }, [debouncedSearch, setSearch])

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-2">
      <div className="relative w-full max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Filtrar por nombre..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      <OrderFiltersDialog />
    </div>
  )
}

export default OrdersFilters
