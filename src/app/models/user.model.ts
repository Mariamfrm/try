export interface User {
  id: number
  login: string
  email: string
  role: "ADMIN" | "VISITEUR"
  etat: boolean
  avatar?: string
  created_at?: string
}

export interface LoginRequest {
  login: string
  password: string
}

export interface LoginResponse {
  user: User
  token?: string
}
