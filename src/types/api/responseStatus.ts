export type APIErrorDetail = {
  code: string
  message: string
  path: string[]
  minimum?: number
  type?: string
  inclusive?: boolean
  exact?: boolean
}

export interface ErrorStatus {
  error: boolean
  message: string | APIErrorDetail[]
}

export interface SuccessStatus {
  success: boolean
  message: string
}
