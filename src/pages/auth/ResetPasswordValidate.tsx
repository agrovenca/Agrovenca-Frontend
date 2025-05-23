import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { useState } from 'react'
import { ResetPasswordValidateSchema } from '@/schemas/auth'
import { resetPasswordValidate } from '@/actions/auth/resetPassword'
import { useNavigate } from 'react-router'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import ErrorForm from '@/components/pages/ErrorForm'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'

function ResetPasswordValidatePage() {
  const [isLoading, setIsLoading] = useState(false)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof ResetPasswordValidateSchema>>({
    resolver: zodResolver(ResetPasswordValidateSchema),
    defaultValues: {
      code: '',
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof ResetPasswordValidateSchema>> = async (data) => {
    setIsLoading(true)
    try {
      const res = await resetPasswordValidate(data)
      if (res.error) {
        setError(res.error)
      }

      if (res.status === 200) {
        const { code, message } = res.data
        toast.success(message)
        form.reset()
        navigate(`/auth/reset-password-confirm/${code}`)
      }
    } catch (_error) {
      toast.error('Un error inesperado ocurrió')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="relative w-full max-w-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Validar código de seguridad
        </CardTitle>
        <CardDescription className="text-center">
          Ingresa el código de seguridad que te enviamos por correo electrónico
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center items-center mx-auto">
                  <FormLabel>Código de seguridad</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={8} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Ingresa el código de seguridad que te enviamos por correo electrónico.
                  </FormDescription>
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
              {isLoading ? <Loader size="sm" variant="spinner" /> : 'Validar'}
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

export default ResetPasswordValidatePage
