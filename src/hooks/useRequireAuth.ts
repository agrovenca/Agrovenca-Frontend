import { useAuthStore } from '@/store/auth/useAuthStore'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useRequireAuth(requiredUser: boolean = true) {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const isLogged = !!user

  useEffect(() => {
    if (requiredUser && !isLogged) {
      navigate('/')
    } else if (!requiredUser && isLogged) {
      navigate('/')
    }
  }, [isLogged, navigate, requiredUser])
}
