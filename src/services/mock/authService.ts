import { IAuthService } from '../interfaces/IAuthService'
import { User, LoginCredentials, SignupData } from '@/domain/types'
import { defaultUser } from '@/data/users'

const AUTH_KEY = 'bdl_auth_user'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const authService: IAuthService = {
  async login(credentials: LoginCredentials): Promise<User> {
    await delay(500)

    if (credentials.email === 'test' && credentials.password === 'test') {
      const user = { ...defaultUser, email: 'test@clubinvest.fr' }
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user))
      }
      return user
    }

    if (credentials.email && credentials.password) {
      const user: User = {
        ...defaultUser,
        id: crypto.randomUUID(),
        email: credentials.email,
        lastLoginAt: new Date().toISOString(),
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user))
      }
      return user
    }

    throw new Error('Identifiants incorrects')
  },

  async signup(data: SignupData): Promise<User> {
    await delay(500)

    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      riskProfile: 'tempere',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      notificationsEnabled: true,
      emailNotifications: true,
      pushNotifications: false,
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    }

    return user
  },

  async logout(): Promise<void> {
    await delay(200)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY)
    }
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(AUTH_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Always pull address/profile fields from defaultUser if missing in stored session
        return {
          ...defaultUser,
          ...parsed,
          address: parsed.address ?? defaultUser.address,
          postalCode: parsed.postalCode ?? defaultUser.postalCode,
          city: parsed.city ?? defaultUser.city,
          biometrics: parsed.biometrics ?? defaultUser.biometrics,
          faceId: parsed.faceId ?? defaultUser.faceId,
        }
      }
    }
    return null
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await delay(300)
    const current = await this.getCurrentUser()
    if (!current || current.id !== userId) {
      throw new Error('Utilisateur non trouvé')
    }

    const updated = { ...current, ...data }
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(updated))
    }

    return updated
  },
}
