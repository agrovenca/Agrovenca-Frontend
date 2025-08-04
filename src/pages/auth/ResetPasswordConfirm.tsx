import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ErrorForm from '@/components/pages/ErrorForm'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ResetPasswordConfirmSchema } from '@/schemas/auth'
import { resetPasswordConfirm } from '@/actions/auth/resetPassword'
import { useParams } from 'react-router'
import { Checkbox } from '@/components/ui/checkbox'
import { togglePasswordVisibility } from '@/lib/utils'

function ResetPasswordConfirmPage() {
  const params = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)

  const code = params.code as string

  useEffect(() => {
    if (!code || code.length <= 0) {
      toast.error('Código de restablecimiento de contraseña no encontrado')
      navigate('/auth/forgot-password/')
    }
  }, [navigate, code])

  const form = useForm<z.infer<typeof ResetPasswordConfirmSchema>>({
    resolver: zodResolver(ResetPasswordConfirmSchema),
    defaultValues: {
      newPassword: '',
      newPasswordConfirm: '',
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof ResetPasswordConfirmSchema>> = async (data) => {
    setIsLoading(true)
    try {
      const res = await resetPasswordConfirm(code, data)
      if (res.error) {
        setError(res.error)
      }

      if (res.status === 200) {
        const { message } = res.data
        toast.success(message)
        form.reset()
        navigate('/auth/login/')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Un error inesperado ocurrió')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="relative w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Restablecer contraseña</CardTitle>
        <CardDescription className="text-center">
          Por favor ingresa tu nueva contraseña 2 veces para confirmar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="newPassword">Nueva contraseña</FormLabel>
                  <Input id="newPassword" type="password" placeholder="••••••••" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="newPasswordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="newPasswordConfirm">Nueva contraseña (confirmar)</FormLabel>
                  <Input
                    id="newPasswordConfirm"
                    type="password"
                    placeholder="••••••••"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <Button
              type="submit"
              disabled={isLoading || !form.formState.isValid}
              className={`${
                isLoading || !form.formState.isValid ? 'cursor-not-allowed' : 'cursor-pointer'
              } w-full`}
            >
              {isLoading ? <Loader size="sm" variant="spinner" /> : 'Guardar'}
            </Button>
          </form>
        </Form>
        <div className="items-top flex gap-2 pt-6">
          <Checkbox
            id="showPassword"
            onCheckedChange={(checked) =>
              togglePasswordVisibility({
                checked,
                inputIds: ['newPassword', 'newPasswordConfirm'],
              })
            }
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="showPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mostrar contraseñas
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {errorStatus.error && <ErrorForm message={errorStatus.message} />}
      </CardFooter>
    </Card>
  )
}

export default ResetPasswordConfirmPage
