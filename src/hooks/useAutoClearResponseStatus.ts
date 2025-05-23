import { useResponseStatusStore } from '@/store/api/useResponseStatus'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useAutoClearResponseStatus = () => {
  const location = useLocation()
  const { clear } = useResponseStatusStore()

  useEffect(() => {
    clear()
  }, [location.pathname, clear])
}
