import { RegisterSchema } from '@/schemas/auth'
import { z } from 'zod'
import axios from 'axios'
import { apiWithCredentials } from '../api'

interface Props {
  data: z.infer<typeof RegisterSchema>
  captchaToken: string | null
}

export const signUp = async ({ data, captchaToken }: Props) => {
  try {
    const res = await apiWithCredentials.post(`/auth/register`, {
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
