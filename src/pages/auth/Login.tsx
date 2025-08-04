import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from 'react-router'
import { useForm, SubmitHandler } from 'react-hook-form'
import { LoginSchema } from '@schemas/auth/index'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login } from '@/actions/auth/login'
import ErrorForm from '@/components/pages/ErrorForm'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { togglePasswordVisibility } from '@/lib/utils'

export default function LoginPage() {
  const setUser = useAuthStore((state) => state.setUser)
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof LoginSchema>> = async (data) => {
    const res = await login(data)

    if (res.error) {
      setError(res.error)
      return
    }

    if (res.status === 200) {
      const { user, message } = res.data
      toast.success(message)
      // Redirect to home page or dashboard
      setUser(user)
      navigate('/')
    }
  }

  return (
    <form className="w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
      <Card className="relative">
        <Button asChild variant={'ghost'} className="absolute left-4 top-4 z-10">
          <Link to="/" viewTransition>
            <ArrowLeft />
          </Link>
        </Button>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            <span style={{ viewTransitionName: 'loginTransitionTitle' }}>Iniciar sesión</span>
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tu email y contraseña para iniciar sesión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register('email')}
                defaultValue={''}
              />
              {errors.email && <ErrorForm message={errors.email.message || ''} />}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  to="/auth/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                {...register('password')}
                defaultValue={''}
              />
              {errors.password && <ErrorForm message={errors.password.message || ''} />}
            </div>

            <div className="items-top flex space-x-2">
              <Checkbox
                id="showPassword"
                onCheckedChange={(checked) =>
                  togglePasswordVisibility({ checked, inputIds: ['password'] })
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
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {errorStatus.error && <ErrorForm message={errorStatus.message} />}

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Ingresar'}
          </Button>
          <div className="text-center text-sm">
            ¿No tienes una cuenta?{' '}
            <Link
              to="/auth/register"
              viewTransition
              style={{ viewTransitionName: 'registerTransitionTitle' }}
              className="font-medium text-primary hover:underline"
            >
              Regístrate
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
