import ExtendedTooltip from '@/components/blocks/ExtendedTooltip'
import ErrorForm from '@/components/pages/ErrorForm'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useOrders from '@/hooks/orders/useOrders'
import useProducts from '@/hooks/products/useProducts'
import useUsers from '@/hooks/users/useUsers'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { OrderStatus } from '@/types/order'
import { zodResolver } from '@hookform/resolvers/zod'
import { PercentIcon } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

interface Options {
  label: string
  children: ReactNode
}

function RenderCard({ label, children }: Options) {
  return (
    <Card
      className={`w-full max-w-sm cursor-pointer transition border-y-0 border-r-0 border-l-6 border-primary bg-primary/20 hover:bg-primary/40 dark:hover:bg-blue-700/30 dark:bg-blue-600/30 dark:border-blue-700 group relative overflow-hidden`}
    >
      {/* <!-- Barra inclinada de brillo --> */}
      <span
        className="pointer-events-none absolute top-[-50%] left-[-50%] h-[200%] w-1/3
           bg-gradient-to-r from-transparent via-[white]/40 to-transparent
           rotate-12
           transform-gpu
           transition-transform duration-1000 ease-in-out
           group-hover:translate-x-[500%]"
      ></span>
      <CardHeader>
        <CardTitle className="font-serif tracking-wider font-extrabold">{label}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-extrabold font-serif text-6xl">{children}</p>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}

const FormSchema = z.object({
  percentage: z.coerce
    .number()
    .min(0)
    .max(100)
    .refine((value) => value !== 0, {
      message: 'El porcentaje no puede ser 0',
    }),
})

function DahsboardIndex() {
  const [showForm, setShowForm] = useState(false)

  const { usersQuery } = useUsers({})
  const { productsQuery } = useProducts({})
  const { ordersQuery } = useOrders()

  const user = useAuthStore((state) => state.user)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      percentage: 0,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.percentage === 0) return
  }

  return (
    <section className="space-y-6">
      <section className="flex gap-2 items-stretch">
        <RenderCard label="Total usuarios">
          {usersQuery.data?.pagination.totalItems || 0}
        </RenderCard>
        <RenderCard label="Total productos">
          {productsQuery.data?.pagination.totalItems || 0}
        </RenderCard>
        <RenderCard label="Pedidos pendientes">
          <div>
            <div>
              {ordersQuery.data?.filter((order) => order.status === OrderStatus.PENDING).length ||
                0}
            </div>
            <div className="absolute bottom-4 right-4 text-2xl">
              <span>Total: {ordersQuery.data?.length || 0}</span>
            </div>
          </div>
        </RenderCard>

        <RenderCard label={`Total ${20.475}`}>20.475</RenderCard>
      </section>
      {user && user.isAdmin && (
        <section className="flex flex-col gap-6">
          <ExtendedTooltip
            content={`${showForm ? 'Cancelar' : 'Ajustar precios de los productos'}`}
          >
            <Button
              size={'lg'}
              onClick={() => setShowForm((prev) => !prev)}
              variant={showForm ? 'destructive' : 'default'}
              className="uppercase font-serif font-bold w-fit cursor-pointer"
            >
              {showForm ? 'Cancelar' : 'Ajustar precios'}
            </Button>
          </ExtendedTooltip>
          {showForm && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xs space-y-6">
                <FormField
                  control={form.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentaje de aumento</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input placeholder="0" type="number" min={0} max={100} {...field} />
                          <span className="ml-2">
                            <PercentIcon />
                          </span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Porcentaje de aumento a aplicar a todos los productos.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.percentage?.message && (
                  <ErrorForm message={form.formState.errors.percentage?.message} />
                )}

                <Button
                  type="submit"
                  className="uppercase font-serif"
                  disabled={form.formState.isSubmitting || !form.formState.isValid}
                >
                  Ajustar precios
                </Button>
              </form>
            </Form>
          )}
        </section>
      )}
    </section>
  )
}

export default DahsboardIndex
