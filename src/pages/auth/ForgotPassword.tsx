import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { toast } from 'sonner'
import { ForgotPasswordSchema } from '@/schemas/auth'
import { resetPasswordEmail } from '@/actions/auth/resetPassword'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import ErrorForm from '@/components/pages/ErrorForm'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Turnstile from 'react-turnstile'
import { useTheme } from '@/components/theme-provider'

function ForgotPasswordPage() {
  const { theme } = useTheme()
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof ForgotPasswordSchema>> = async (data) => {
    setIsLoading(true)

    if (!captchaToken) {
      toast.error('Por favor valida el captcha antes de enviar')
      return
    }

    try {
      const res = await resetPasswordEmail({ data, captchaToken })
      if (res.error) {
        setError(res.error)
      }

      if (res.status === 200) {
        const { message } = res.data
        toast.success(message)
        form.reset()
        navigate('/auth/reset-password-validate/')
      }
    } catch (_error) {
      toast.error('Un error inesperado ocurrió')
    } finally {
      setIsLoading(false)
      setCaptchaToken(null)
    }
  }
  return (
    <Card className="relative w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          <span style={{ viewTransitionName: 'loginTransitionTitle' }}>Restablecer contraseña</span>
        </CardTitle>
        <CardDescription className="text-center">
          Ingresa tu correo electrónico para recibir un enlace de restablecimiento de contraseña.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                  <Input id="email" type="email" placeholder="Correo electrónico" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <div className="flex justify-center">
              <Turnstile
                sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY!}
                onSuccess={(token: string | null) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                theme={theme === 'dark' ? 'dark' : 'light'}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !form.formState.isValid || !captchaToken}
              className={`${
                isLoading || !form.formState.isValid || !captchaToken
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              } w-full`}
            >
              {isLoading ? <Loader size="sm" variant="spinner" /> : 'Enviar'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {errorStatus.error && <ErrorForm message={errorStatus.message} />}
      </CardFooter>
    </Card>
  )
}

export default ForgotPasswordPage
