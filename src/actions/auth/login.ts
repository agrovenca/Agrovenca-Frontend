import { LoginSchema } from '@/schemas/auth'
import { z } from 'zod'
import axios from 'axios'
import { apiWithCredentials } from '../api'

interface Props {
  data: z.infer<typeof LoginSchema>
  captchaToken: string | null
}

export const login = async ({ data, captchaToken }: Props) => {
  try {
    const res = await apiWithCredentials.post(`/auth/login`, {
      ...data,
      captchaToken,
    })
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
