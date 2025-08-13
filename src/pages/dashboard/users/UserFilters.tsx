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
import { UserFilterParams } from '@/types/user'
import { limitOptions } from '@/lib/productLimitOptions'
import { useUserFiltersStore } from '@/store/users/useUserFiltersStore'

interface Props {
  handleFilterSubmit: (params: UserFilterParams) => void
}

export default function UserFilters({ handleFilterSubmit }: Props) {
  const limit = useUserFiltersStore((state) => state.limit)
  const search = useUserFiltersStore((state) => state.search)
  const isActive = useUserFiltersStore((state) => state.isActive)
  const form = useForm({
    defaultValues: {
      limit,
      search,
      isActive,
    },
  })

  const handleReset = () => {
    const defaultValues = { search: '', limit: 10, categoryId: '', isActive: undefined }
    form.reset(defaultValues)
    handleFilterSubmit(defaultValues)
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
            className="w-full flex flex-col justify-between gap-4 mb-4"
            onSubmit={form.handleSubmit(handleFilterSubmit)}
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
                    placeholder="Buscar usuario por nombre o email"
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
                  <FormLabel htmlFor="limit">Usuarios por página</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Número de usuarios por página" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {limitOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          Mostrar {option.label}
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
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="limit">Estado de usuarios</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtra usuario activos o inactivos" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={'active'}>Activo</SelectItem>
                      <SelectItem value={'inactive'}>Inactivo</SelectItem>
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
