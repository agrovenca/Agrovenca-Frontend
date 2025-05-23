import { ErrorStatus, SuccessStatus } from '@/types/api/responseStatus'
import { create } from 'zustand'

type ResponseStatusStore = {
  errorStatus: ErrorStatus
  successStatus: SuccessStatus
  setError: (message: ErrorStatus['message']) => void
  setSuccess: (message: string) => void
  clear: () => void
}

export const useResponseStatusStore = create<ResponseStatusStore>((set) => ({
  errorStatus: { error: false, message: '' },
  successStatus: { success: false, message: '' },
  setError: (message) =>
    set({
      errorStatus: { error: true, message },
      successStatus: { success: false, message: '' },
    }),
  setSuccess: (message) =>
    set({
      successStatus: { success: true, message },
      errorStatus: { error: false, message: '' },
    }),
  clear: () =>
    set({
      errorStatus: { error: false, message: '' },
      successStatus: { success: false, message: '' },
    }),
}))
