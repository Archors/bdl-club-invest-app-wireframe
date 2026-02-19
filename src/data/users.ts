import { User } from '@/domain/types'

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'jean.dupont@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '06 12 34 56 78',
    address: '47 avenue des Champs-Élysées',
    postalCode: '75008',
    city: 'Paris',
    riskProfile: 'tempere',
    createdAt: '2023-01-15T10:30:00Z',
    lastLoginAt: '2024-12-15T14:20:00Z',
    notificationsEnabled: true,
    emailNotifications: true,
    pushNotifications: false,
    biometrics: true,
    faceId: false,
    sponsorCode: 'JEAN-DUP-2025',
  },
]

export const defaultUser = mockUsers[0]
