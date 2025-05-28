import { BaseFilterParams } from '../shared'

export interface User {
  id: string
  email: string
  name: string
  lastName: string
  isMod: boolean
  isAdmin: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserFilterParams extends BaseFilterParams {
  isActive: 'active' | 'inactive' | undefined
}
