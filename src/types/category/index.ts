import { User } from '../auth/user'

export interface Category {
  id: string
  name: string
  description?: string
  active: boolean
  user: User
  createdAt: string
  updatedAt: string
}
