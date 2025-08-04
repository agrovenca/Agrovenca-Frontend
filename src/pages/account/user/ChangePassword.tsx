import { changePassword } from '@/actions/account/user'
import ErrorForm from '@/components/pages/ErrorForm'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRequireAuth } from '@/hooks/useRequireAuth'
import { togglePasswordVisibility } from '@/lib/utils'
import { ChangePasswordSchema } from '@/schemas/user'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

function ChangePassword() {
  useRequireAuth()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      passwordConfirm: '',
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof ChangePasswordSchema>> = async (data) => {
    if (!user) {
      return
    }

    const res = await changePassword(user.id, data)

    if (res.error) {
      setError(res.error)
      return
    }

    if (res.status === 200) {
      const { message } = res.data
      toast.success(message)
      setUser(null)
      return
    }
  }

  return (
    <section className="w-full h-full py-6">
      <form className="w-full max-w-screen-2xl mx-auto space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-1">
          <Label htmlFor="currentPassword" className="mb-2">
            Actual contraseña
          </Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder="••••••"
            {...register('currentPassword')}
          />
          {errors.currentPassword && <ErrorForm message={errors.currentPassword.message || ''} />}
        </div>
        <div className="flex gap-6 items-start justify-center flex-wrap">
          <div className="flex-1">
            <Label htmlFor="password" className="mb-2 text-nowrap">
              Nueva contraseña
            </Label>
            <Input id="password" type="password" placeholder="••••••" {...register('password')} />
            {errors.password && <ErrorForm message={errors.password.message || ''} />}
          </div>
          <div className="flex-1">
            <Label htmlFor="passwordConfirm" className="mb-2 text-nowrap">
              Confirmar nueva contraseña
            </Label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder="••••••"
              {...register('passwordConfirm')}
            />
            {errors.passwordConfirm && <ErrorForm message={errors.passwordConfirm.message || ''} />}
          </div>
        </div>

        <div className="items-top flex space-x-2">
          <Checkbox
            id="showPassword"
            onCheckedChange={(checked) =>
              togglePasswordVisibility({
                checked,
                inputIds: ['currentPassword', 'password', 'passwordConfirm'],
              })
            }
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="showPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mostrar contraseña
            </label>
          </div>
        </div>

        {errorStatus.error && <ErrorForm message={errorStatus.message} />}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Actualizar'}
        </Button>
      </form>
    </section>
  )
}

export default ChangePassword
