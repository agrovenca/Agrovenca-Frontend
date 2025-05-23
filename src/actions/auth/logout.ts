import axios from 'axios'
import { apiWithCredentials } from '../api'

export const logout = async () => {
  try {
    const res = await apiWithCredentials.post(`/auth/logout`, {})
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { error: 'An unknown error occurred' }
    }
    return { error: 'An unknown error occurred' }
  }
}
