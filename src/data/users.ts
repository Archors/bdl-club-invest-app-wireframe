import { User } from '@/domain/types'

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'jean.dupont@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '06 12 34 56 78',
    riskProfile: 'tempere',
    createdAt: '2023-01-15T10:30:00Z',
    lastLoginAt: '2024-12-15T14:20:00Z',
    notificationsEnabled: true,
    emailNotifications: true,
    pushNotifications: false,
  },
]

export const defaultUser = mockUsers[0]
