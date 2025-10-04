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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import useOrders from '@/hooks/orders/useOrders'
import useProducts from '@/hooks/products/useProducts'
import useUsers from '@/hooks/users/useUsers'
import { ChangePricesSchema } from '@/schemas/products'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { OrderStatus } from '@/types/order'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  InfoIcon,
  MessageSquareWarning,
  MoveDownIcon,
  MoveRightIcon,
  MoveUpIcon,
  PercentIcon,
} from 'lucide-react'
import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { updatePrices } from '@/actions/products'

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
        <div className="font-extrabold font-serif text-6xl">{children}</div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}

function DahsboardIndex() {
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const { usersQuery } = useUsers({})
  const { productsQuery } = useProducts({})
  const { ordersQuery } = useOrders()

  const user = useAuthStore((state) => state.user)

  const form = useForm<z.infer<typeof ChangePricesSchema>>({
    resolver: zodResolver(ChangePricesSchema),
    defaultValues: {
      percentage: 0,
      increment: true,
    },
  })

  const percentageValue = form.watch('percentage')
  const incrementValue = form.watch('increment')

  async function onSubmit(data: z.infer<typeof ChangePricesSchema>) {
    if (data.percentage === 0) return

    try {
      const response = await updatePrices({ data })

      if (response.status !== 200) {
        setIsLoading(false)
        return
      }

      if (response.status === 200) {
        const { message } = response.data
        toast.success(message)
        setIsLoading(false)
        return
      }
    } catch (error) {
      console.log({ error })
    } finally {
      setIsLoading(false)
    }
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-md space-y-6 border p-4 rounded-lg border-destructive"
              >
                <Alert variant="destructive">
                  <MessageSquareWarning />
                  <AlertTitle>¡Cuidado!</AlertTitle>
                  <AlertDescription>
                    Esto afectará el precio de todos los productos en tu base de datos, aumentará o
                    disminuirá los precios (también el segundo) basado en el porcentaje que
                    indiques.
                  </AlertDescription>
                </Alert>
                <FormField
                  control={form.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentaje de cambio</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input placeholder="0" min={0} {...field} />
                          <span className="ml-2">
                            <PercentIcon />
                          </span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Debe estar en formato natural.
                        <span className="w-full flex items-center gap-1">
                          <span>✅ (e.j.) 3.5%</span> <MoveRightIcon /> <span>3.5</span>
                        </span>
                        <span className="w-full flex items-center gap-1">
                          <span>✅ (e.j.) 5%</span> <MoveRightIcon /> <span>5</span>
                        </span>
                        <span className="w-full flex items-center gap-1">
                          <span>❌ (e.j.) 8%</span> <MoveRightIcon /> <span>0.08</span>
                        </span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="increment"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Acción</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(val) => field.onChange(val === 'true')}
                          value={field.value ? 'true' : 'false'}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="true" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              <MoveUpIcon className="h-5 w-5" /> <span>Incrementar</span>
                            </FormLabel>
                          </FormItem>

                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="false" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              <MoveDownIcon className="h-5 w-5" /> <span>Decrementar</span>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {percentageValue.toString() !== '0' && (
                  <Alert>
                    <InfoIcon />
                    <AlertTitle>
                      Los precios {incrementValue ? 'aumentarán' : 'disminuirán'} en un factor del{' '}
                      {percentageValue}%
                    </AlertTitle>
                  </Alert>
                )}

                {form.formState.errors.percentage?.message && (
                  <ErrorForm message={form.formState.errors.percentage?.message} />
                )}

                <Button
                  type="submit"
                  className={cn(
                    'uppercase font-serif ',
                    (form.formState.isSubmitting || !form.formState.isValid || isLoading) &&
                      'cursor-not-allowed'
                  )}
                  disabled={form.formState.isSubmitting || !form.formState.isValid || isLoading}
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
