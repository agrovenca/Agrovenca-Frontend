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
import { UserFilterParams } from '@/types/auth/user'

interface UserFiltersProps {
  initialSearch: string
  initialLimit: number
  initialIsActive: UserFilterParams['isActive']
  onSubmit: (values: Omit<UserFilterParams, 'page'>) => void
}

export default function UserFilters({
  initialSearch,
  initialLimit,
  initialIsActive,
  onSubmit,
}: UserFiltersProps) {
  const form = useForm({
    defaultValues: {
      search: initialSearch,
      limit: initialLimit,
      isActive: initialIsActive,
    },
  })

  const handleFormSubmit = (data: Omit<UserFilterParams, 'page'>) => {
    onSubmit({ search: data.search.trim(), limit: Number(data.limit), isActive: data.isActive })
  }

  const handleReset = () => {
    const defaultValues = { search: '', limit: 10, categoryId: '', isActive: undefined }
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
