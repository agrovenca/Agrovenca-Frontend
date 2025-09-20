import axios from 'axios'
import { apiWithOutCredentials } from '../api'
import z from 'zod'
import { ContactSchema } from '@/schemas/contact'

interface ContactResponse {
  message: string
  error?: string
  success: boolean
}

interface Props {
  contactData: z.infer<typeof ContactSchema>
  captchaToken: string | null
}

export const contactSendMessage = async ({
  contactData,
  captchaToken,
}: Props): Promise<ContactResponse> => {
  try {
    const { data } = await apiWithOutCredentials.post(`/contacts/send-message`, {
      ...contactData,
      captchaToken,
    })
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || { error: 'Ocurrió un error desconocido' }
      throw new Error(errorData.error ?? 'Ocurrió un error desconocido')
    }
    throw new Error('Ocurrió un error desconocido')
  }
}
