export type RiskProfile = 'tempere' | 'audacieux'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  postalCode?: string
  city?: string
  riskProfile: RiskProfile
  createdAt: string
  lastLoginAt?: string
  notificationsEnabled: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  biometrics?: boolean
  faceId?: boolean
  sponsorCode?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}
