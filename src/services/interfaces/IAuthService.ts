import { User, LoginCredentials, SignupData } from '@/domain/types'

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<User>
  signup(data: SignupData): Promise<User>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
  updateProfile(userId: string, data: Partial<User>): Promise<User>
}
