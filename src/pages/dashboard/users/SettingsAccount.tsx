import ErrorForm from '@/components/pages/ErrorForm'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DotIcon, SettingsIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { Loader } from '@/components/ui/loader'
import { User } from '@/types/auth/user'
import { Dispatch, SetStateAction, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { UserAccountSettingsSchema } from '@/schemas/user'
import { updateAccountOptions } from '@/actions/users'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

type Props = {
  user: User
  users: User[]
  setUsers: Dispatch<SetStateAction<User[]>>
}

type RadioOptionProps = {
  id: string
  value: string
  label: string
  isActive: boolean
  props: React.InputHTMLAttributes<HTMLInputElement>
}

const RadioOption = ({ id, value, label, isActive, props }: RadioOptionProps) => (
  <div className="flex items-center space-x-2">
    <Input type="radio" value={value} id={id} className="w-4.5 h-4.5" {...props} />
    <Label htmlFor={id}>
      {label} {isActive && <DotIcon className="text-blue-500 dark:text-yellow-300" />}
    </Label>
  </div>
)

function AccountOptions({ user, users, setUsers }: Props) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, control } = useForm<z.infer<typeof UserAccountSettingsSchema>>({
    resolver: zodResolver(UserAccountSettingsSchema),
    defaultValues: {
      isActive: user.isActive,
      role: user.isMod ? 'mod' : 'client',
    },
  })
  const errorStatus = useResponseStatusStore((state) => state.errorStatus)
  const setError = useResponseStatusStore((state) => state.setError)

  const onSubmit: SubmitHandler<z.infer<typeof UserAccountSettingsSchema>> = async (data) => {
    setIsLoading(true)
    const res = await updateAccountOptions(user.id, data)

    if (res.error) {
      setError(res.error)
      setIsLoading(false)
      return
    }

    if (res.status === 200) {
      const { user: updatedUser, message } = res.data
      toast.success(message)
      setIsLoading(false)
      setOpen(false)
      const newData = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      setUsers(newData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          title="Configuración de cuenta"
          size={'icon'}
          variant={'ghost'}
          className="cursor-pointer text-yellow-400"
        >
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Configuración de la cuenta de{' '}
            <span className="text-blue-500">
              {user.name} {user.lastName}
            </span>
          </DialogTitle>
          <DialogDescription>
            Estás a punto de cambiar las propiedades de este usuario. Se cuidadoso
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="isActive"
            control={control}
            defaultValue={user.isActive}
            render={({ field }) => (
              <div className="flex items-start justify-between space-x-4 rounded-lg border p-4">
                <div className="space-y-1">
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    {field.value ? 'Cuenta activa' : 'Cuenta inactiva'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {user.isActive
                      ? 'Desactiva la cuenta para impedir el acceso del usuario.'
                      : 'Activa la cuenta para permitir el acceso del usuario.'}
                  </p>
                </div>
                <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />
          <Separator />

          <div className="grid gap-1.5 leading-none">
            <RadioOption
              id="mod"
              value="mod"
              label="Convertir en Moderador"
              isActive={user.isMod}
              props={register('role')}
            />
            <RadioOption
              id="client"
              value="client"
              label="Convertir en Cliente"
              isActive={!user.isMod}
              props={register('role')}
            />
          </div>

          {errorStatus.error && <ErrorForm message={errorStatus.message} />}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader size="sm" variant="spinner" /> : 'Guardar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AccountOptions
