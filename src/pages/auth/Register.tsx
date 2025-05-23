import { signUp } from '@/actions/auth/signUp'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { togglePasswordVisibility } from '@/lib/utils'
import { RegisterSchema } from '@/schemas/auth'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

function Register() {
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof RegisterSchema>> = async (data) => {
    const res = await signUp(data)

    if (res.error) {
      setError(res.error)
      return
    }

    if (res.status === 201) {
      const { message } = res.data
      toast.success(message)
      navigate('/auth/login')
    }
  }

  return (
    <form className="w-full max-w-xl" onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full relative">
        <Button asChild variant={'ghost'} className="absolute left-4 top-4 z-10">
          <Link to="/" viewTransition>
            <ArrowLeft />
          </Link>
        </Button>
        <CardHeader className="space-y-1">
          <CardTitle
            className="text-2xl font-bold text-center"
            style={{ viewTransitionName: 'registerTransitionTitle' }}
          >
            Register
          </CardTitle>
          <CardDescription className="text-center">
            Create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" placeholder="John" {...register('name')} />
                {errors.name && <ErrorForm message={errors.name.message || ''} />}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" placeholder="Doe" {...register('lastName')} />
                {errors.lastName && <ErrorForm message={errors.lastName.message || ''} />}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
              {errors.email && <ErrorForm message={errors.email.message || ''} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && <ErrorForm message={errors.password.message || ''} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">Confirm Password</Label>
              <Input id="passwordConfirm" type="password" {...register('passwordConfirm')} />
              {errors.passwordConfirm && (
                <ErrorForm message={errors.passwordConfirm.message || ''} />
              )}
            </div>
            <div className="items-top flex space-x-2">
              <Checkbox
                id="showPassword"
                onCheckedChange={(checked) =>
                  togglePasswordVisibility({ checked, inputIds: ['password', 'passwordConfirm'] })
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
            {isLoading ? 'Loading...' : 'Register'}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              viewTransition
              className="font-medium text-primary hover:underline"
            >
              <span style={{ viewTransitionName: 'loginTransitionTitle' }}>Login</span>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}

export default Register
