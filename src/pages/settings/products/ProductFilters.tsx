import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { FilterIcon } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCategoriesStore } from '@/store/dashboard/useCategoriesStore'
import { ProductFilterParams } from '@/types/product'

interface ProductFiltersProps {
  initialSearch: string
  initialLimit: number
  initialCategoryId: string
  onSubmit: (values: Omit<ProductFilterParams, 'page'>) => void
}

export default function ProductFilters({
  initialSearch,
  initialLimit,
  initialCategoryId,
  onSubmit,
}: ProductFiltersProps) {
  const categories = useCategoriesStore((state) => state.categories)

  const form = useForm({
    defaultValues: {
      search: initialSearch,
      limit: initialLimit,
      categoryId: initialCategoryId,
    },
  })

  const handleFormSubmit = (data: Omit<ProductFilterParams, 'page'>) => onSubmit(data)

  const handleReset = () => {
    const defaultValues = { search: '', limit: 10, categoryId: '' }
    form.reset(defaultValues)
    onSubmit(defaultValues)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'}>
          <FilterIcon />
          <span>Filtrar</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
          <DialogDescription>Filtra productos</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="w-full flex flex-col justify-between gap-4 mb-4"
          >
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="search">Buscar</FormLabel>
                  <Input
                    id="search"
                    type="search"
                    placeholder="Buscar producto por nombre"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="limit">Productos por página</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Número de productos por página" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3].map((value) => (
                        <SelectItem key={value} value={value.toString()}>
                          {value} por página
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="categoryId">Productos por categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar productos por categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-1 gap-2 items-center">
              <Button type="button" onClick={handleReset} variant={'secondary'} className="ml-2">
                Quitar filtros
              </Button>
              <Button type="submit" className="ml-2">
                Filtrar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
