import axios from 'axios'
import { apiWithOutCredentials } from '../api'

export const getShippingAddresses = async (userId: string) => {
  try {
    const res = await apiWithOutCredentials.get(`/shipping/addresses`, { params: { userId } })
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
