import { Notification } from '@/domain/types'

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'success',
    category: 'transaction',
    title: 'Versement effectué',
    message: 'Votre versement de 2 000 € a été crédité sur votre contrat Assurance Vie BDL Premium.',
    read: false,
    createdAt: '2024-12-15T10:30:00Z',
    actionUrl: '/app/contracts/contract-1',
    contractId: 'contract-1',
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'info',
    category: 'document',
    title: 'Nouveau document disponible',
    message: 'Votre relevé de situation de décembre 2024 est disponible.',
    read: false,
    createdAt: '2024-12-15T08:00:00Z',
    actionUrl: '/app/documents',
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'info',
    category: 'performance',
    title: 'Performance mensuelle',
    message: 'Votre portefeuille a progressé de +1.2% ce mois-ci.',
    read: true,
    createdAt: '2024-12-01T09:00:00Z',
    actionUrl: '/app/performance',
  },
  {
    id: 'notif-4',
    userId: 'user-1',
    type: 'warning',
    category: 'system',
    title: 'Profil investisseur à mettre à jour',
    message: 'Votre profil investisseur date de plus d\'un an. Nous vous recommandons de le mettre à jour.',
    read: true,
    createdAt: '2024-11-20T10:00:00Z',
    actionUrl: '/app/profile',
  },
  {
    id: 'notif-5',
    userId: 'user-1',
    type: 'success',
    category: 'transaction',
    title: 'Arbitrage exécuté',
    message: 'Votre arbitrage du 15/11 a été exécuté avec succès.',
    read: true,
    createdAt: '2024-11-15T16:30:00Z',
    actionUrl: '/app/transactions',
  },
]

export function getNotificationsByUserId(userId: string): Notification[] {
  return mockNotifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getUnreadCount(userId: string): number {
  return mockNotifications.filter((n) => n.userId === userId && !n.read).length
}
