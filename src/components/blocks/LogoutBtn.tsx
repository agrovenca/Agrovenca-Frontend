import { logout } from '@/actions/auth/logout'
import { useAuthStore } from '@/store/auth/useAuthStore'
import { Button } from '../ui/button'
import { LogOutIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

type Props = {
  showIcon?: boolean
}

function LogoutBtn({ showIcon }: Props) {
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()

  const handleEvent = async () => {
    const res = await logout()

    if (res.status === 200) {
      setUser(null)
      navigate('/')
    }
    return
  }

  if (showIcon) {
    return (
      <Button
        variant={'outline'}
        size={'icon'}
        onClick={handleEvent}
        title="Logout"
        className="cursor-pointer"
      >
        <LogOutIcon />
      </Button>
    )
  }
  return (
    <Button
      onClick={handleEvent}
      title="Logout"
      size={'sm'}
      variant={'outline'}
      className="cursor-pointer w-full flex items-center gap-2"
    >
      <LogOutIcon />
      <span>Cerrar sesión</span>
    </Button>
  )
}

export default LogoutBtn
